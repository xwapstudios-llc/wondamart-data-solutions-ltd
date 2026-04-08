use std::sync::Arc;
use tokio::task::JoinHandle;
use std::time::Duration;
use tokio::time::sleep;

use crate::db_model::Transaction;
use crate::error::AppError;

use super::transaction_manager::TransactionManager;

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

/// Transaction Worker: Monitors and manages uncompleted transactions
/// - Runs in the background throughout the application lifetime
/// - On startup, reads uncompleted transactions from the database
/// - Periodically checks for uncompleted transactions
/// - Can be extended to re-process or verify transaction status
pub struct TransactionWorker {
    manager: Arc<TransactionManager>,
    config: TransactionWorkerConfig,
}

impl TransactionWorker {
    /// Create a new TransactionWorker instance
    pub fn new(manager: Arc<TransactionManager>, config: TransactionWorkerConfig) -> Self {
        Self { manager, config }
    }

    /// Initialize the worker: Read and process uncompleted transactions on startup
    pub async fn initialize(&self) -> Result<(), AppError> {
        log::info!("Initializing transaction worker...");

        match self.manager.get_uncompleted_transactions().await {
            Ok(transactions) => {
                log::info!(
                    "Found {} uncompleted transactions on startup",
                    transactions.len()
                );

                for tx in transactions {
                    if let Some(tx_id) = tx.tx_id {
                        log::debug!(
                            "Monitoring uncompleted transaction: tx_id={}, status={}, agent_id={}",
                            tx_id,
                            tx.status_str,
                            tx.agent_id
                        );
                    }
                }

                Ok(())
            }
            Err(e) => {
                log::warn!("Failed to load uncompleted transactions on startup: {:?}", e);
                // Don't fail initialization if we can't load transactions
                Ok(())
            }
        }
    }

    /// Run the periodic check loop
    /// This method should be spawned as a background task
    pub async fn run_check_loop(self: Arc<Self>) {
        log::info!(
            "Starting transaction worker check loop with interval: {}s",
            self.config.check_interval_secs
        );

        loop {
            sleep(Duration::from_secs(self.config.check_interval_secs)).await;

            if let Err(e) = self.check_and_process_uncompleted_transactions().await {
                log::error!("Error in transaction worker check loop: {:?}", e);
            }
        }
    }

    /// Check for uncompleted transactions and log their status
    async fn check_and_process_uncompleted_transactions(&self) -> Result<(), AppError> {
        match self.manager.get_uncompleted_transactions().await {
            Ok(transactions) => {
                if !transactions.is_empty() {
                    log::info!(
                        "Found {} uncompleted transactions in check cycle",
                        transactions.len()
                    );

                    for tx in transactions {
                        self.process_transaction(&tx).await;
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

    /// Process a single uncompleted transaction
    async fn process_transaction(&self, tx: &Transaction) {
        if let Some(tx_id) = tx.tx_id {
            log::debug!(
                "Processing transaction: tx_id={}, status={}, agent_id={}, type={}",
                tx_id,
                tx.status_str,
                tx.agent_id,
                tx.type_str
            );

            // Here you can add logic to:
            // 1. Verify transaction status with third-party providers
            // 2. Re-attempt failed transactions
            // 3. Clean up stuck transactions
            // 4. Generate notifications

            // Example: Log old pending transactions
            if let Some(created_at) = tx.created_at {
                let now = time::OffsetDateTime::now_utc();
                let age_secs = (now - created_at).whole_seconds();
                let timeout_secs = self.config.transaction_timeout_secs as i64;

                if age_secs > timeout_secs {
                    log::warn!(
                        "Transaction {} has been pending for {}s (timeout: {}s)",
                        tx_id,
                        age_secs,
                        timeout_secs
                    );
                    // Could mark as failed or trigger manual intervention here
                }
            }
        }
    }

    /// Stop the worker gracefully
    pub async fn shutdown(&self) {
        log::info!("Shutting down transaction worker...");
    }
}

/// Start the transaction worker as a background task
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
            log::error!("Failed to initialize transaction worker: {:?}", e);
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


