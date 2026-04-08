use std::sync::Arc;
use sqlx::PgPool;
use std::time::Duration;
use tokio::time::sleep;

use crate::db_model::{Transaction, TransactionStatus, TransactionType, DBModel};
use crate::error::AppError;

/// Configuration for the TransactionManager
#[derive(Clone, Debug)]
pub struct TransactionManagerConfig {
    /// Number of retries for failed transactions
    pub max_retries: usize,
    /// Base delay between retries in milliseconds
    pub retry_delay_ms: u64,
    /// Delay before executing a transaction in milliseconds
    pub pre_transaction_delay_ms: u64,
}

impl Default for TransactionManagerConfig {
    fn default() -> Self {
        Self {
            max_retries: 3,
            retry_delay_ms: 1000,
            pre_transaction_delay_ms: 500,
        }
    }
}

/// Transaction Manager: Orchestrates transaction lifecycle
/// - Creates transaction entries in the database
/// - Manages transaction status based on user (uid)
/// - Calls third-party provider APIs with retry logic
/// - Implements pre-transaction delays
pub struct TransactionManager {
    pool: Arc<PgPool>,
    config: TransactionManagerConfig,
}

impl TransactionManager {
    /// Create a new TransactionManager instance
    pub fn new(pool: Arc<PgPool>, config: TransactionManagerConfig) -> Self {
        Self { pool, config }
    }

    /// Create a new transaction entry in the database
    /// Returns the transaction ID if successful
    pub async fn create_transaction(
        &self,
        agent_id: i32,
        tx_type: TransactionType,
        amount: Option<sqlx::types::BigDecimal>,
        commission: Option<sqlx::types::BigDecimal>,
        balance: Option<sqlx::types::BigDecimal>,
        api_id: Option<String>,
        data: serde_json::Value,
    ) -> Result<i32, AppError> {
        let tx = Transaction {
            tx_id: None,
            agent_id,
            type_str: tx_type.as_str().to_string(),
            status_str: TransactionStatus::Pending.as_str().to_string(),
            amount,
            commission,
            balance,
            api_id,
            data,
            admin_data: None,
            created_at: None,
            updated_at: None,
            completed_at: None,
        };

        tx.new_db_entry(&*self.pool).await
    }

    /// Update transaction status in the database
    pub async fn update_transaction_status(
        &self,
        tx_id: i32,
        status: TransactionStatus,
    ) -> Result<(), AppError> {
        let mut tx = Transaction::from_db(&*self.pool, tx_id).await?;
        tx.set_status(status);
        tx.updated_at = Some(time::OffsetDateTime::now_utc());

        if status == TransactionStatus::Success || status == TransactionStatus::Failed {
            tx.completed_at = Some(time::OffsetDateTime::now_utc());
        }

        tx.update_db(&*self.pool).await
    }

    /// Update transaction status with additional data
    pub async fn update_transaction_with_data(
        &self,
        tx_id: i32,
        status: TransactionStatus,
        data: serde_json::Value,
    ) -> Result<(), AppError> {
        let mut tx = Transaction::from_db(&*self.pool, tx_id).await?;
        tx.set_status(status);
        tx.data = data;
        tx.updated_at = Some(time::OffsetDateTime::now_utc());

        if status == TransactionStatus::Success || status == TransactionStatus::Failed {
            tx.completed_at = Some(time::OffsetDateTime::now_utc());
        }

        tx.update_db(&*self.pool).await
    }

    /// Get a transaction by ID
    pub async fn get_transaction(&self, tx_id: i32) -> Result<Transaction, AppError> {
        Transaction::from_db(&*self.pool, tx_id).await
    }

    /// Get all pending/processing transactions for a specific user
    pub async fn get_user_pending_transactions(
        &self,
        agent_id: i32,
    ) -> Result<Vec<Transaction>, AppError> {
        let transactions = sqlx::query_as!(
            Transaction,
            r#"
            SELECT tx_id, agent_id, type as "type_str: _", status as "status_str: _", amount, commission, balance, api_id, data, admin_data, created_at, updated_at, completed_at
            FROM transactions
            WHERE agent_id = $1 AND (status = 'pending' OR status = 'processing')
            ORDER BY created_at DESC
            "#,
            agent_id
        )
        .fetch_all(&*self.pool)
        .await?;

        Ok(transactions)
    }

    /// Get all uncompleted transactions in the system
    pub async fn get_uncompleted_transactions(&self) -> Result<Vec<Transaction>, AppError> {
        let transactions = sqlx::query_as!(
            Transaction,
            r#"
            SELECT tx_id, agent_id, type as "type_str: _", status as "status_str: _", amount, commission, balance, api_id, data, admin_data, created_at, updated_at, completed_at
            FROM transactions
            WHERE status IN ('pending', 'processing')
            ORDER BY created_at
            "#
        )
        .fetch_all(&*self.pool)
        .await?;

        Ok(transactions)
    }

    /// Get transaction history for a user with pagination
    pub async fn get_user_transaction_history(
        &self,
        agent_id: i32,
        limit: i64,
        offset: i64,
    ) -> Result<Vec<Transaction>, AppError> {
        let transactions = sqlx::query_as!(
            Transaction,
            r#"
            SELECT tx_id, agent_id, type as "type_str: _", status as "status_str: _", amount, commission, balance, api_id, data, admin_data, created_at, updated_at, completed_at
            FROM transactions
            WHERE agent_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
            "#,
            agent_id,
            limit,
            offset
        )
        .fetch_all(&*self.pool)
        .await?;

        Ok(transactions)
    }

    /// Apply pre-transaction delay
    pub async fn apply_pre_transaction_delay(&self) {
        sleep(Duration::from_millis(
            self.config.pre_transaction_delay_ms,
        ))
        .await;
    }

    /// Calculate exponential backoff delay for retry
    fn calculate_retry_delay(&self, attempt: usize) -> Duration {
        let delay = self.config.retry_delay_ms * (2_u64.pow(attempt as u32));
        Duration::from_millis(delay)
    }

    /// Execute a transaction with retry logic and delays
    /// The callback function should handle the actual API call
    pub async fn execute_transaction_with_retry<F, T>(
        &self,
        tx_id: i32,
        mut callback: F,
    ) -> Result<T, AppError>
    where
        F: FnMut() -> futures::future::BoxFuture<'static, Result<T, AppError>>,
    {
        // Apply pre-transaction delay
        self.apply_pre_transaction_delay().await;

        // Update status to Processing
        self.update_transaction_status(tx_id, TransactionStatus::Processing)
            .await?;

        let mut last_error: Option<AppError> = None;

        for attempt in 0..self.config.max_retries {
            match callback().await {
                Ok(result) => {
                    // Mark as success
                    self.update_transaction_status(tx_id, TransactionStatus::Success)
                        .await?;
                    return Ok(result);
                }
                Err(e) => {
                    last_error = Some(e);

                    if attempt < self.config.max_retries - 1 {
                        let delay = self.calculate_retry_delay(attempt);
                        sleep(delay).await;
                    }
                }
            }
        }

        // All retries failed
        self.update_transaction_status(tx_id, TransactionStatus::Failed)
            .await?;

        Err(last_error.unwrap_or_else(|| {
            AppError::BadRequest("Transaction failed after all retries".to_string())
        }))
    }

    /// Get configuration
    pub fn config(&self) -> &TransactionManagerConfig {
        &self.config
    }

    /// Get pool reference
    pub fn pool(&self) -> &Arc<PgPool> {
        &self.pool
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_retry_delay_calculation() {
        let config = TransactionManagerConfig::default();
        let manager = TransactionManager::new(
            Arc::new(sqlx::PgPool::connect_lazy("postgres://").unwrap()),
            config,
        );

        // Exponential backoff: 1000, 2000, 4000, etc.
        assert_eq!(manager.calculate_retry_delay(0), Duration::from_millis(1000));
        assert_eq!(manager.calculate_retry_delay(1), Duration::from_millis(2000));
        assert_eq!(manager.calculate_retry_delay(2), Duration::from_millis(4000));
    }
}









