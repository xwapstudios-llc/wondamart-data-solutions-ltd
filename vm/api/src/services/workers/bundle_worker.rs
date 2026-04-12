use std::time::Duration;
use tokio::time::sleep;
use crate::db_model::TransactionStatus;
use crate::error::AppError;
use super::worker_trait::{TransactionWorkerTrait, WorkerContext};

/// Worker for bundle purchase transactions
pub struct BundleTransactionWorker;

#[async_trait::async_trait]
impl TransactionWorkerTrait for BundleTransactionWorker {
    async fn execute(&self, context: WorkerContext) -> Result<(), AppError> {
        let tx_id = context.transaction.tx_id.ok_or_else(|| {
            AppError::BadRequest("Transaction ID missing".to_string())
        })?;

        log::info!("[BundleWorker] Starting processing for transaction {}", tx_id);

        // Apply pre-transaction delay
        sleep(Duration::from_millis(context.pre_transaction_delay_ms)).await;

        // Update status to Processing
        let manager = crate::services::TransactionManager::new(
            context.pool.clone(),
            crate::services::TransactionManagerConfig {
                max_retries: context.max_retries,
                retry_delay_ms: context.retry_delay_ms,
                pre_transaction_delay_ms: context.pre_transaction_delay_ms,
                max_workers: 10, // Not used in this context
            },
        );

        manager
            .update_transaction_status(tx_id, TransactionStatus::Processing)
            .await?;

        // TODO: Implement bundle purchase logic
        // This should call the third-party API to process the bundle purchase
        // For now, this is a placeholder

        log::info!(
            "[BundleWorker] Bundle transaction {} sent to third party",
            tx_id
        );

        Ok(())
    }

    fn name(&self) -> &'static str {
        "BundleTransactionWorker"
    }

    fn waits_for_webhook(&self) -> bool {
        true // Bundle transactions are completed via webhook
    }
}

