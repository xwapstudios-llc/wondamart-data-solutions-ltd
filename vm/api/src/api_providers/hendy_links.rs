use crate::db_model::{NetworkType};
use crate::error::AppError;
use serde::{Deserialize, Serialize};
use crate::api_providers::api_client::ApiClient;

#[derive(Serialize, Deserialize, Debug)]
enum HendyNetworkType {
    MTN,
    Telecel,
    AirtelTigo
}
impl From<HendyNetworkType> for NetworkType {
    fn from(value: HendyNetworkType) -> Self {
        match value {
            HendyNetworkType::MTN => NetworkType::Mtn,
            HendyNetworkType::Telecel => NetworkType::Telecel,
            HendyNetworkType::AirtelTigo => NetworkType::Airteltigo
        }
    }
}

#[derive(Deserialize, Debug)]
enum HendyOrderStatus {
    #[serde(rename = "processing")]
    Processing,
    #[serde(rename = "completed")]
    Completed,
    #[serde(rename = "failed")]
    Failed
}

#[derive(Serialize, Debug)]
pub struct HendyCreateOrderReq {
    recipient_phone: String,
    network: HendyNetworkType,
    size_gb: Option<u32>,
}

#[derive(Deserialize, Debug)]
pub struct HendyCreateOrderRes {
    success: bool,
    message: Option<String>,
    oder_id: u32,
    status: String,
}
#[derive(Deserialize, Debug)]
pub struct HendyApiRes<T> {
    success: bool,
    message: Option<String>,
    data: Option<T>
}
#[derive(Deserialize, Debug)]
pub struct HendyOrder {
    id: u32,
    status: HendyOrderStatus,
    message: Option<String>,
    amount: u32,
    recipient_phone: String,
    plan_name: Option<String>,
    network: HendyNetworkType,
    size_mb: u32,
    created_at: String,
    updated_at: String,
}

#[derive(Deserialize, Debug)]
pub struct HendyBalanceRes {
    balance: f32,
    currency: Option<String>,
}

#[derive(Deserialize, Debug)]
struct NamePhone {
    phone: String,
    name: String
}

#[derive(Deserialize, Debug)]
pub struct HendyWebhookPayload {
    event: String,
    timestamp: String,
    order: HendyOrder,
    user: Option<NamePhone>
}

pub struct HendyApiClient(ApiClient);

impl HendyApiClient {
    #[inline]
    async fn new(pool: &sqlx::PgPool) -> Result<Self, AppError> {
        Ok(Self(ApiClient::new(pool, "hendylinks".to_string(), "X-API-KEY").await?))
    }

    async fn create_order(&self, order: HendyCreateOrderReq) -> Result<HendyCreateOrderRes, AppError> {
        let res = self.0.client
            .post(format!("{}/api/orders", self.0.api_provider.url))
            .json(&order)
            .send()
            .await?;

        Ok(serde_json::from_value(res.json().await?)?)
    }

    async fn get_orders(&self, limit: u32, offset: u32, ) -> Result<HendyApiRes<Vec<HendyOrder>>, AppError> {
        let res = self.0.client
            .get(format!("{}/api/orders?limit={}&offset={}", self.0.api_provider.url, limit, offset))
            .send()
            .await?;

        Ok(serde_json::from_value(res.json().await?)?)
    }

    async fn get_balance(&self) -> Result<HendyApiRes<HendyBalanceRes>, AppError> {
        let res = self.0.client
            .get(format!("{}/api/balance", self.0.api_provider.url))
            .send()
            .await?;

        Ok(serde_json::from_value(res.json().await?)?)
    }
}