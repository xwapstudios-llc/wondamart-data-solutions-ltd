use crate::db_model::{NetworkType};
use crate::error::AppError;
use serde::{Deserialize, Serialize};
use crate::api_providers::api_client::ApiClient;

#[derive(Serialize, Deserialize, Debug)]
pub enum SykesNetworkType {
    MTN,
    Telecel,
    AirtelTigo
}
impl From<SykesNetworkType> for NetworkType {
    fn from(value: SykesNetworkType) -> Self {
        match value {
            SykesNetworkType::MTN => NetworkType::Mtn,
            SykesNetworkType::Telecel => NetworkType::Telecel,
            SykesNetworkType::AirtelTigo => NetworkType::Airteltigo
        }
    }
}
impl From<NetworkType> for SykesNetworkType {
    fn from(value: NetworkType) -> Self {
        match value {
            NetworkType::Mtn => Self::MTN,
            NetworkType::Telecel => Self::Telecel,
            NetworkType::Airteltigo => Self::AirtelTigo
        }
    }
}

#[derive(Deserialize, Debug)]
enum SykesOrderStatus {
    #[serde(rename = "processing")]
    Processing,
    #[serde(rename = "completed")]
    Completed,
    #[serde(rename = "failed")]
    Failed
}

#[derive(Serialize, Debug)]
pub struct SykesCreateOrderReq {
    pub recipient_phone: String,
    pub network: SykesNetworkType,
    pub size_gb: u32,
    pub oder_id: String,
}

#[derive(Serialize, Debug)]
pub struct SykesCreateAFAOrderReq {
    #[serde(rename="Full_Name")]
    pub full_name: String,
    #[serde(rename="Ghana_Card_Number")]
    pub ghana_card: String,
    #[serde(rename="Occupation_type")]
    pub occupation: u32,
}

#[derive(Deserialize, Debug)]
pub struct SykesCreateOrderRes {
    success: bool,
    message: Option<String>,
    order_id: Option<u32>,
    status: Option<String>,
    is_duplicate: Option<bool>,
}
#[derive(Deserialize, Debug)]
pub struct SykesApiRes<T> {
    success: bool,
    message: Option<String>,
    data: Option<T>
}
#[derive(Deserialize, Debug)]
pub struct SykesOrder {
    id: u32,
    status: SykesOrderStatus,
    message: Option<String>,
    amount: u32,
    recipient_phone: String,
    plan_name: Option<String>,
    network: SykesNetworkType,
    size_mb: u32,
    created_at: String,
    updated_at: String,
}

#[derive(Deserialize, Debug)]
pub struct SykesBalanceRes {
    balance: f32,
    currency: Option<String>,
}

#[derive(Deserialize, Debug)]
struct NamePhone {
    phone: String,
    name: String
}

#[derive(Deserialize, Debug)]
pub struct SykesWebhookPayload {
    event: String,
    timestamp: String,
    order: SykesOrder,
    user: Option<NamePhone>
}

pub struct SykesApiClient(ApiClient);

impl SykesApiClient {
    #[inline]
    pub fn api_id() -> &'static str {
        "sykes"
    }

    #[inline]
    pub async fn new(pool: &sqlx::PgPool) -> Result<Self, AppError> {
        Ok(Self(ApiClient::new(pool, Self::api_id().to_string(), "X-API-KEY").await?))
    }

    pub async fn create_order(&self, order: SykesCreateOrderReq) -> Result<SykesCreateOrderRes, AppError> {
        let res = self.0.client
            .post(format!("{}/api/orders", self.0.api_provider.url))
            .json(&order)
            .send()
            .await?;

        // println!("[Sykes order response -->] {:?}", res.bytes().await?);

        Ok(serde_json::from_value(res.json().await?)?)
    }

    pub async fn get_orders(&self, limit: u32, offset: u32, ) -> Result<SykesApiRes<Vec<SykesOrder>>, AppError> {
        let res = self.0.client
            .get(format!("{}/api/orders?limit={}&offset={}", self.0.api_provider.url, limit, offset))
            .send()
            .await?;

        Ok(serde_json::from_value(res.json().await?)?)
    }

    pub async fn get_balance(&self) -> Result<SykesApiRes<SykesBalanceRes>, AppError> {
        let res = self.0.client
            .get(format!("{}/api/balance", self.0.api_provider.url))
            .send()
            .await?;

        Ok(serde_json::from_value(res.json().await?)?)
    }

    pub async fn create_afa_order(&self, order: SykesCreateAFAOrderReq) -> Result<SykesCreateOrderRes, AppError> {
        let res = self.0.client
            .post(format!("{}/api/afa/register", self.0.api_provider.url))
            .json(&order)
            .send()
            .await?;

        Ok(serde_json::from_value(res.json().await?)?)
    }
}