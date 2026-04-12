use std::sync::Arc;
use tokio::task::JoinHandle;
use std::time::Duration;
use tokio::time::sleep;

use crate::db_model::{Transaction, TransactionType};
use crate::error::AppError;

use super::transaction_manager::TransactionManager;
use super::workers::{
    TransactionWorkerTrait, WorkerContext, BundleTransactionWorker, AfaTransactionWorker,
    DepositTransactionWorker,
};

/// Background worker configuration for transaction processing
#[derive(Clone, Debug)]
pub struct TransactionWorkerConfig {
    /// Interval to check for uncompleted transactions (in seconds)
    pub check_interval_secs: u64,
    /// Timeout for each transaction check (in seconds)
    pub transaction_timeout_secs: u64,
}

impl Default for TransactionWorkerConfig {
    fn default() -> Self {
        Self {
            check_interval_secs: 30,
            transaction_timeout_secs: 300,
        }
    }
}

/// Transaction Worker Pool Manager: Monitors and spawns workers for pending transactions
/// - Runs in the background throughout the application lifetime
/// - On startup, reads uncompleted transactions from the database
/// - Periodically checks for uncompleted transactions
/// - Spawns individual workers for each pending transaction (respecting max_workers limit)
/// - Each worker is an async Tokio task that handles a specific transaction type
pub struct TransactionWorker {
    manager: Arc<TransactionManager>,
    config: TransactionWorkerConfig,
}

impl TransactionWorker {
    /// Create a new TransactionWorker instance
    pub fn new(manager: Arc<TransactionManager>, config: TransactionWorkerConfig) -> Self {
        Self { manager, config }
    }

    /// Initialize the worker: Read and spawn workers for uncompleted transactions on startup
    pub async fn initialize(&self) -> Result<(), AppError> {
        log::info!("Initializing transaction worker pool...");

        match self.manager.get_uncompleted_transactions().await {
            Ok(transactions) => {
                log::info!(
                    "Found {} uncompleted transactions on startup",
                    transactions.len()
                );

                for tx in transactions {
                    if let Some(tx_id) = tx.tx_id {
                        log::debug!(
                            "Scheduling worker for transaction: tx_id={}, status={}, type={}",
                            tx_id,
                            tx.status_str,
                            tx.type_str
                        );

                        // Spawn worker for this transaction if not already active
                        if !self.manager.has_active_worker(tx_id).await {
                            self.spawn_worker_for_transaction(tx).await;
                        }
                    }
                }

                Ok(())
            }
            Err(e) => {
                log::warn!(
                    "Failed to load uncompleted transactions on startup: {:?}",
                    e
                );
                // Don't fail initialization if we can't load transactions
                Ok(())
            }
        }
    }

    /// Run the periodic check loop
    /// This method should be spawned as a background task
    pub async fn run_check_loop(self: Arc<Self>) {
        log::info!(
            "Starting transaction worker pool check loop with interval: {}s",
            self.config.check_interval_secs
        );

        loop {
            sleep(Duration::from_secs(self.config.check_interval_secs)).await;

            if let Err(e) = self.check_and_spawn_workers().await {
                log::error!("Error in transaction worker check loop: {:?}", e);
            }
        }
    }

    /// Check for uncompleted transactions and spawn workers for pending ones
    async fn check_and_spawn_workers(&self) -> Result<(), AppError> {
        match self.manager.get_uncompleted_transactions().await {
            Ok(transactions) => {
                if !transactions.is_empty() {
                    log::info!(
                        "Found {} uncompleted transactions in check cycle",
                        transactions.len()
                    );

                    for tx in transactions {
                        if let Some(tx_id) = tx.tx_id {
                            // Only spawn worker if one isn't already active
                            if !self.manager.has_active_worker(tx_id).await {
                                self.spawn_worker_for_transaction(tx).await;
                            }
                        }
                    }
                }
                Ok(())
            }
            Err(e) => {
                log::error!("Failed to fetch uncompleted transactions: {:?}", e);
                Err(e)
            }
        }
    }

    /// Spawn a worker for a specific transaction
    /// The worker type is determined by the transaction type
    async fn spawn_worker_for_transaction(&self, tx: Transaction) {
        if let Some(tx_id) = tx.tx_id {
            // Acquire worker slot before spawning
            let _permit = self.manager.acquire_worker_slot().await;

            let manager = Arc::clone(&self.manager);
            let tx_copy = tx.clone();

            let handle = tokio::spawn(async move {
                let worker_name = match tx_copy.transaction_type() {
                    Ok(TransactionType::BundlePurchase) => "BundleWorker",
                    Ok(TransactionType::AfaPurchase) => "AfaWorker",
                    Ok(TransactionType::PaystackDeposit)
                    | Ok(TransactionType::ManualDeposit) => "DepositWorker",
                    _ => "UnknownWorker",
                };

                log::info!(
                    "[{}] Spawned for transaction tx_id={}",
                    worker_name,
                    tx_id
                );

                let result = match tx_copy.transaction_type() {
                    Ok(TransactionType::BundlePurchase) => {
                        let worker = BundleTransactionWorker;
                        Self::execute_worker(&worker, &manager, tx_copy).await
                    }
                    Ok(TransactionType::AfaPurchase) => {
                        let worker = AfaTransactionWorker;
                        Self::execute_worker(&worker, &manager, tx_copy).await
                    }
                    Ok(TransactionType::PaystackDeposit)
                    | Ok(TransactionType::ManualDeposit) => {
                        let worker = DepositTransactionWorker;
                        Self::execute_worker(&worker, &manager, tx_copy).await
                    }
                    _ => {
                        log::warn!(
                            "[UnknownWorker] Unsupported transaction type: {}",
                            tx_copy.type_str
                        );
                        Ok(())
                    }
                };

                match result {
                    Ok(_) => {
                        log::info!("[{}] Completed successfully for tx_id={}", worker_name, tx_id);
                    }
                    Err(e) => {
                        log::error!(
                            "[{}] Error for tx_id={}: {:?}",
                            worker_name,
                            tx_id,
                            e
                        );
                    }
                }

                // Unregister the worker
                manager.unregister_worker(tx_id).await;
            });

            // Register the worker handle
            self.manager.register_worker(tx_id, handle).await;
        }
    }

    /// Execute a worker with the provided transaction
    async fn execute_worker(
        worker: &dyn TransactionWorkerTrait,
        manager: &Arc<TransactionManager>,
        tx: Transaction,
    ) -> Result<(), AppError> {
        let config = manager.config();

        let context = WorkerContext {
            pool: manager.pool().clone(),
            transaction: tx,
            max_retries: config.max_retries,
            retry_delay_ms: config.retry_delay_ms,
            pre_transaction_delay_ms: config.pre_transaction_delay_ms,
        };

        worker.execute(context).await
    }

    /// Shutdown the worker pool gracefully
    pub async fn shutdown(&self) {
        log::info!("Shutting down transaction worker pool...");
        log::info!(
            "Active workers: {}",
            self.manager.active_worker_count().await
        );
    }
}

/// Start the transaction worker pool as a background task
/// Returns a JoinHandle that can be used to manage the task
pub fn start_transaction_worker(
    manager: Arc<TransactionManager>,
    config: Option<TransactionWorkerConfig>,
) -> JoinHandle<()> {
    let config = config.unwrap_or_default();
    let worker = Arc::new(TransactionWorker::new(manager, config));

    // Initialize the worker
    let worker_clone = Arc::clone(&worker);
    tokio::spawn(async move {
        if let Err(e) = worker_clone.initialize().await {
            log::error!("Failed to initialize transaction worker pool: {:?}", e);
        }

        // Run the check loop
        worker_clone.run_check_loop().await;
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_worker_config_default() {
        let config = TransactionWorkerConfig::default();
        assert_eq!(config.check_interval_secs, 30);
        assert_eq!(config.transaction_timeout_secs, 300);
    }
}


