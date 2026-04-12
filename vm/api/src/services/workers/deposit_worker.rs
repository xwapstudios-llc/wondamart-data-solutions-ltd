use std::time::Duration;
use tokio::time::sleep;
use crate::db_model::TransactionStatus;
use crate::error::AppError;
use super::worker_trait::{TransactionWorkerTrait, WorkerContext};

/// Worker for deposit transactions (Paystack, Manual, etc.)
pub struct DepositTransactionWorker;

#[async_trait::async_trait]
impl TransactionWorkerTrait for DepositTransactionWorker {
    async fn execute(&self, context: WorkerContext) -> Result<(), AppError> {
        let tx_id = context.transaction.tx_id.ok_or_else(|| {
            AppError::BadRequest("Transaction ID missing".to_string())
        })?;

        log::info!("[DepositWorker] Starting processing for transaction {}", tx_id);

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

        // TODO: Implement deposit logic
        // This should verify the deposit with the payment provider
        // For now, this is a placeholder

        log::info!(
            "[DepositWorker] Deposit transaction {} sent to verification",
            tx_id
        );

        Ok(())
    }

    fn name(&self) -> &'static str {
        "DepositTransactionWorker"
    }

    fn waits_for_webhook(&self) -> bool {
        true // Deposit transactions are typically completed via webhook
    }
}

