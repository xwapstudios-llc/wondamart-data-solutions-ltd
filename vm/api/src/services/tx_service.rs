use crate::db_model::{AFABundle, DBModel, DataBundle, Transaction, TransactionSource, TransactionStatus, TransactionType, UserWallet};
use crate::error::AppError;
use serde_json::json;
use sqlx::PgPool;
use std::sync::Arc;
use crate::api_providers::sykes_official::SykesCreateAFAOrderReq;

pub struct TxService {
    pool: Arc<PgPool>,
    transactions: Vec<i32>,
}

impl TxService {
    #[inline]
    pub fn new(pool: Arc<PgPool>) -> Self {
        Self {
            pool,
            transactions: vec![],
        }
    }
    pub fn new_arc(pool: Arc<PgPool>) -> Arc<Self> {
        Arc::new(Self::new(pool))
    }

    /// Create a data_bundle transaction in the database and return the transaction id.
    /// Fails if agent does not have enough balance
    pub async fn create_data_bundle(
        &mut self,
        transaction_source: TransactionSource,
        agent_id: i32,
        bundle: &DataBundle,
        phone: &String,
    ) -> Result<i32, AppError> {
        let agent_wallet = UserWallet::from_db(&*self.pool, agent_id).await?;
        if agent_wallet.amount < bundle.selling_price {
            return Err(AppError::InsufficientBalance);
        }

        let cost_price = {
            if let Some(v) = bundle.cost_price.as_object() {
                v.get(&bundle.api_id)
                    .unwrap_or(&json!(0.0))
                    .as_f64()
                    .unwrap_or(0.0)
            } else {
                0.0
            }
        };
        let tx_id = Transaction::new_tx(
            &*self.pool,
            agent_id,
            TransactionType::BundlePurchase,
            &bundle.selling_price,
            &bundle.commission,
            agent_wallet.amount.clone() - bundle.selling_price.clone(),
            Some(bundle.api_id.clone()),
            transaction_source,
            json!({
                "id": bundle.id,
                "network": bundle.network,
                "data_amount": bundle.data_amount,
                "validity": bundle.validity_period,
                "phone": phone,
            }),
            Some(json!({ "cost_price": cost_price })),
        )
        .await?;

        agent_wallet.sub(&*self.pool, &bundle.selling_price).await?;
        self.transactions.push(tx_id);

        Ok(tx_id)
    }
    
    pub async fn create_afa(&mut self, tx_source: TransactionSource, agent_id: i32, order: &SykesCreateAFAOrderReq) -> Result<i32, AppError> {
        let bundle = AFABundle::from_db(&*self.pool, "afa".into()).await?;
        
        let agent_wallet = UserWallet::from_db(&*self.pool, agent_id).await?;
        if agent_wallet.amount < bundle.selling_price {
            return Err(AppError::InsufficientBalance);
        }

        let tx_id = Transaction::new_tx(
            &*self.pool,
            agent_id,
            TransactionType::AfaPurchase,
            &bundle.selling_price,
            &bundle.commission,
            agent_wallet.amount.clone() - bundle.selling_price.clone(),
            Some(bundle.api_id.clone()),
            tx_source,
            json!(order),
            Some(json!({ "cost_price": bundle.cost_price })),
        )
        .await?;

        agent_wallet.sub(&*self.pool, &bundle.selling_price).await?;
        self.transactions.push(tx_id);

        Ok(tx_id) 
    }

    #[inline]
    async fn tx_failed(&mut self, tx_id: i32) -> Result<(), AppError> {
        Transaction::update_status(&*self.pool, tx_id, TransactionStatus::Failed).await?;
        self.transactions.retain(|&id| id != tx_id);
        Ok(())
    }
    #[inline]
    async fn tx_success(&mut self, tx_id: i32) -> Result<(), AppError> {
        Transaction::update_status(&*self.pool, tx_id, TransactionStatus::Success).await?;
        self.transactions.retain(|&id| id != tx_id);
        Ok(())
    }
    #[inline]
    async fn tx_processing(&mut self, tx_id: i32) -> Result<(), AppError> {
        Transaction::update_status(&*self.pool, tx_id, TransactionStatus::Processing).await?;
        Ok(())
    }
}
