use crate::db_model::{ApiProvider, DBModel, NetworkType};
use crate::error::AppError;
use reqwest::{Client, header, Response};
use sqlx::PgPool;
use std::sync::Arc;
use std::time::Duration;
use serde::Serialize;

pub struct HendyLinksClient {
    client: Client,
    api_provider: ApiProvider,
}

#[derive(Serialize, Debug)]
pub struct CreateOrderRequest {
    recipient_phone: String,
    data_plan_id: Option<u32>,
    network: NetworkType,
    size_gb: Option<u32>,
}

impl NetworkType {
    pub fn as_hendy_links_str(&self) -> &'static str {
        match self {
            NetworkType::Mtn => "MTN",
            NetworkType::Telecel => "Telecel",
            NetworkType::Airteltigo => "AirtelTigo",
        }
    }
}

impl HendyLinksClient {
    async fn new(pool: &Arc<PgPool>) -> Result<Self, AppError> {
        let provider = ApiProvider::from_db(pool, "hendylinks".to_string()).await?;

        match provider.api_key.clone() {
            Some(api_key) => {
                let mut headers = header::HeaderMap::new();

                if let Ok(mut auth_value) = header::HeaderValue::from_str(api_key.as_str()) {
                    auth_value.set_sensitive(true);
                    headers.insert(header::AUTHORIZATION, auth_value);

                    let client = Client::builder()
                        .default_headers(headers)
                        .timeout(Duration::from_secs(provider.timeout_seconds.unwrap_or(30) as u64))
                        .build();
                    if let Ok(client) = client {
                        return Ok(Self { client, api_provider: provider });
                    };
                }

                Err(AppError::Internal(
                    "Failed to create HendyLinks API client".to_string(),
                ))
            },
            _ => Err(AppError::Internal(format!("Failed to retrieve API key: {:?}", provider.api_key))),
        }
    }

    async fn create_order(&self, order: CreateOrderRequest) -> Result<Response, AppError> {
        match self.api_provider.url.clone() {
            None => Err(AppError::Internal("Failed to send order to hendy-links".to_string())),
            Some(url) => {
                let res = self.client
                    .post(format!("{}/api/orders", url))
                    .json(&order) // Todo: Make hard serialization
                    .send()
                    .await?;

                Ok(res)
            }
        }
    }

    async fn get_orders(&self, limit: u32, offset: u32,) -> Result<Response, AppError> {
        match self.api_provider.url.clone() {
            None => Err(AppError::Internal("Failed to fetch orders from hendy-links".to_string())),
            Some(url) => {
                let res = self.client
                    .get(format!("{}/api/orders?limit={}&offset={}", url, limit, offset))
                    .send()
                    .await?;

                Ok(res)
            }
        }
    }

    async fn get_balance(&self) -> Result<Response, AppError> {
        match self.api_provider.url.clone() {
            None => Err(AppError::Internal("Failed to fetch balance from hendy-links".to_string())),
            Some(url) => {
                let res = self.client
                    .get(format!("{}/api/balance", url))
                    .send()
                    .await?;

                Ok(res)
            }
        }
    }

    async fn deposit(&self, amount: f32) -> Result<Response, AppError> {
        match self.api_provider.url.clone() {
            None => Err(AppError::Internal("Failed to post deposit request to hendy-links".to_string())),
            Some(url) => {
                let res = self.client
                    .get(format!("{}/api/deposit?amount={}", url, amount))
                    .send()
                    .await?;

                Ok(res)
            }
        }
    }
}
