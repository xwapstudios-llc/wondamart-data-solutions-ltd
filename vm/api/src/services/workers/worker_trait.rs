use std::sync::Arc;
use sqlx::PgPool;
use crate::db_model::Transaction;
use crate::error::AppError;

/// Context provided to transaction workers
pub struct WorkerContext {
    pub pool: Arc<PgPool>,
    pub transaction: Transaction,
    pub max_retries: usize,
    pub retry_delay_ms: u64,
    pub pre_transaction_delay_ms: u64,
}

/// Trait that all transaction workers must implement
/// Different transaction types will implement this trait to handle their specific logic
#[async_trait::async_trait]
pub trait TransactionWorkerTrait: Send + Sync {
    /// Execute the transaction worker
    /// Returns Ok(()) if the worker completes successfully
    /// The worker should update transaction status to Processing before starting
    /// The worker should handle retries for network errors
    async fn execute(&self, context: WorkerContext) -> Result<(), AppError>;

    /// Get a human-readable name for this worker type
    fn name(&self) -> &'static str;

    /// Check if this worker should wait for webhook completion
    /// If true, the worker stops after sending to third party
    /// If false, the worker waits for and marks completion itself
    fn waits_for_webhook(&self) -> bool {
        true
    }
}

