use std::sync::Arc;
use sqlx::PgPool;
use crate::api_providers::getus_site::{GetusApiClient, GetusCreateOrderReq};
use crate::api_providers::hendy_links::{HendyApiClient, HendyCreateOrderReq};
use crate::api_providers::sykes_official::{SykesApiClient, SykesCreateAFAOrderReq, SykesCreateOrderReq};
use crate::db_model::{DBModel, DataBundle};
use crate::error::AppError;

pub struct BundleService {
    pool: Arc<PgPool>,
    hendy: HendyApiClient,
    sykes: SykesApiClient,
    getus: GetusApiClient
}

impl BundleService {
    pub async fn new(pool: Arc<PgPool>) -> Result<Arc<Self>, AppError> {
        Ok(Arc::new(Self {
            pool: pool.clone(),
            hendy: HendyApiClient::new(pool.as_ref()).await?,
            sykes: SykesApiClient::new(pool.as_ref()).await?,
            getus: GetusApiClient::new(pool.as_ref()).await?,
        }))
    }

    pub(crate) async fn reload_clients(&mut self) -> Result<(), AppError> {
        self.hendy = HendyApiClient::new(self.pool.as_ref()).await?;
        self.sykes = SykesApiClient::new(self.pool.as_ref()).await?;
        self.getus = GetusApiClient::new(self.pool.as_ref()).await?;
        Ok(())
    }

    pub async fn new_bundle(&self, bundle_id: String, phone: String) -> Result<(), AppError> {
        println!("[services::bundle_service::new_bundle()] An Order received...");

        let bundle = DataBundle::from_db(&self.pool, bundle_id).await?;

        match bundle.api_id.as_str() {
            "hendylinks" => {
                let res = self.hendy.create_order( HendyCreateOrderReq {
                    recipient_phone: phone,
                    network: bundle.network.into(),
                    size_gb: bundle.data_amount as u32
                }).await?;

                println!("Created hendy order {:?}", res);
            }

            "sykes" => {
                println!("[new_bundle()::sykes] Sending order to sykes... Bundle: {:?}, phone: {}", bundle, phone);
                let res = self.sykes.create_order( SykesCreateOrderReq {
                    recipient_phone: phone,
                    network: bundle.network.into(),
                    size_gb: bundle.data_amount as u32,
                }).await?;

                println!("Created hendy order {:?}", res);
            }

            "getus" => {
                let res = self.getus.place_order( GetusCreateOrderReq {
                    recipient: phone,
                    network: bundle.network.into(),
                    package_gb: bundle.data_amount as u32
                }).await?;

                println!("Created getus order {:?}", res);
            }

            _ => return Err(AppError::Internal(format!("Invalid API id: {:?}", bundle.api_id)))
        }

        Ok(())
    }

    pub async fn new_afa_bundle_service(&self, full_name: String, ghana_card: String, occupation: String, contact: String, location: String) -> Result<(), AppError> {
        println!("[services::bundle_service::new_afa_bundle()] An Order received...");

        let res = self.sykes.create_afa_order( SykesCreateAFAOrderReq {
            full_name: full_name,
            ghana_card: ghana_card,
            occupation: occupation,
            contact: contact,
            location: location,
        }).await?;

        println!("Created hendy order {:?}", res);

        Ok(())
    }
}
