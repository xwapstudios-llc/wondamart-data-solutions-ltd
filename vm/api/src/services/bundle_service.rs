use crate::api_providers::getus_site::{GetusApiClient, GetusCreateOrderReq};
use crate::api_providers::hendy_links::{HendyApiClient, HendyCreateOrderReq};
use crate::api_providers::sykes_official::{
    SykesApiClient, SykesCreateAFAOrderReq, SykesCreateOrderReq,
};
use crate::db_model::{DBModel, DataBundle, TransactionSource};
use crate::error::AppError;
use crate::services::tx_service::TxService;
use sqlx::PgPool;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct BundleService {
    pool: Arc<PgPool>,
    hendy: HendyApiClient,
    sykes: SykesApiClient,
    getus: GetusApiClient,
}

impl BundleService {
    pub async fn new(pool: Arc<PgPool>) -> Result<Self, AppError> {
        Ok(Self {
            pool: pool.clone(),
            hendy: HendyApiClient::new(pool.as_ref()).await?,
            sykes: SykesApiClient::new(pool.as_ref()).await?,
            getus: GetusApiClient::new(pool.as_ref()).await?,
        })
    }

    pub(crate) async fn reload_clients(&mut self) -> Result<(), AppError> {
        self.hendy = HendyApiClient::new(self.pool.as_ref()).await?;
        self.sykes = SykesApiClient::new(self.pool.as_ref()).await?;
        self.getus = GetusApiClient::new(self.pool.as_ref()).await?;
        Ok(())
    }

    pub async fn new_bundle(
        &self,
        tx: Arc<Mutex<TxService>>,
        source: TransactionSource,
        agent_id: i32,
        bundle_id: String,
        phone: String,
    ) -> Result<(), AppError> {
        println!("[services::bundle_service::new_bundle()] An Order received...");

        let bundle = DataBundle::from_db(&self.pool, bundle_id).await?;
        {
            // So that I can release the lock on bundle before the db write
            let _tx_id = tx.lock().await.create_data_bundle(source, agent_id, &bundle, &phone).await?;
        }

        if bundle.api_id.as_str() == HendyApiClient::api_id() {
            let res = self.hendy
                .create_order(HendyCreateOrderReq {
                    recipient_phone: phone,
                    network: bundle.network.into(),
                    size_gb: bundle.data_amount as u32,
                })
                .await?;

            println!("Created hendy order {:?}", res);
        } else if bundle.api_id.as_str() == SykesApiClient::api_id() {
            let res = self.sykes
                .create_order(SykesCreateOrderReq {
                    recipient_phone: phone,
                    network: bundle.network.into(),
                    size_gb: bundle.data_amount as u32,
                })
                .await?;

            println!("Created hendy order {:?}", res);
        } else if bundle.api_id.as_str() == GetusApiClient::api_id() {
            let res = self.getus
                .place_order(GetusCreateOrderReq {
                    recipient: phone,
                    network: bundle.network.into(),
                    package_gb: bundle.data_amount as u32,
                })
                .await?;

            println!("Created getus order {:?}", res);
        } else {
            return Err(AppError::Internal(format!(
                "Unknown api id: {:?}",
                bundle.api_id
            )));
        }

        Ok(())
    }

    pub async fn new_afa_bundle_service(
        &self,
        tx: Arc<Mutex<TxService>>,
        source: TransactionSource,
        agent_id: i32,
        full_name: String,
        ghana_card: String,
        occupation: String,
        contact: String,
        location: String,
    ) -> Result<(), AppError> {
        println!("[services::bundle_service::new_afa_bundle()] An Order received...");

        let order = SykesCreateAFAOrderReq {
            full_name,
            ghana_card,
            occupation,
            contact,
            location,
        };
        {
            // So that I can release the lock on bundle before the db write
            let _tx_id = tx.lock().await.create_afa(source, agent_id, &order).await?;
        }

        let res = self.sykes
            .create_afa_order(order)
            .await?;

        println!("Created sykes afa_bundle order {:?}", res);
        Ok(())
    }
}
