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

        let mut headers = header::HeaderMap::new();

        if let Ok(mut auth_value) = header::HeaderValue::from_str(provider.api_key.as_str()) {
            auth_value.set_sensitive(true);
            headers.insert(header::AUTHORIZATION, auth_value);

            let client = Client::builder()
                .default_headers(headers)
                .timeout(Duration::from_secs(provider.timeout_seconds as u64))
                .build();
            if let Ok(client) = client {
                return Ok(Self { client, api_provider: provider });
            };
        }

        Err(AppError::Internal(
            "Failed to create HendyLinks API client".to_string(),
        ))
    }

    async fn create_order(&self, order: CreateOrderRequest) -> Result<Response, AppError> {
        let res = self.client
            .post(format!("{}/api/orders", self.api_provider.url))
            .json(&order) // Todo: Make hard serialization
            .send()
            .await?;

        Ok(res)
    }

    async fn get_orders(&self, limit: u32, offset: u32,) -> Result<Response, AppError> {
        let res = self.client
            .get(format!("{}/api/orders?limit={}&offset={}", self.api_provider.url, limit, offset))
            .send()
            .await?;

        Ok(res)
    }

    async fn get_balance(&self) -> Result<Response, AppError> {
        let res = self.client
            .get(format!("{}/api/balance", self.api_provider.url))
            .send()
            .await?;

        Ok(res)
    }

    async fn deposit(&self, amount: f32) -> Result<Response, AppError> {
        let res = self.client
            .get(format!("{}/api/deposit?amount={}", self.api_provider.url, amount))
            .send()
            .await?;

        Ok(res)
    }
}
