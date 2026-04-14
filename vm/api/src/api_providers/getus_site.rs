use serde::{Serialize, Deserialize};
use crate::api_providers::api_client::ApiClient;
use crate::db_model::NetworkType;
use crate::error::AppError;

#[derive(Serialize, Debug)]
pub struct GetusCreateOrderReq {
    pub recipient: String,
    pub network: GetusNetworkType,
    pub package_gb: u32,
}
#[derive(Deserialize, Debug)]
pub struct GetusCreateOrderRes {
    status: String,
    order_id: u32,
    price: f32
}

#[derive(Serialize, Deserialize, Debug)]
pub enum GetusNetworkType {
    MTN,
    Telecel,
    AirtelTigo
}
impl From<GetusNetworkType> for NetworkType {
    fn from(value: GetusNetworkType) -> Self {
        match value {
            GetusNetworkType::MTN => NetworkType::Mtn,
            GetusNetworkType::Telecel => NetworkType::Telecel,
            GetusNetworkType::AirtelTigo => NetworkType::Airteltigo
        }
    }
}
impl From<NetworkType> for GetusNetworkType {
    fn from(value: NetworkType) -> Self {
        match value {
            NetworkType::Mtn => Self::MTN,
            NetworkType::Telecel => Self::Telecel,
            NetworkType::Airteltigo => Self::AirtelTigo
        }
    }
}

#[derive(Deserialize, Debug)]
pub enum GetusOrderStatus {
    #[serde(rename = "IN_PROGRESS")]
    InProgress,
    #[serde(rename = "SUCCESS")]
    Success,
    #[serde(rename = "FAILED")]
    Failed
}

#[derive(Deserialize, Debug)]
pub struct GetusCheckOrderStatusRes {
    status: String,
    order_id: u32,
    order_status: GetusOrderStatus,
    raw_status: Option<String>,
    network: GetusNetworkType,
    package_gb: u32,
    recipient: String,
    price: f32,
    source: Option<String>,
    created_at: Option<String>,
    updated_at: Option<String>,
}

pub struct GetusApiClient(pub(crate) ApiClient);

impl GetusApiClient {
    #[inline]
    pub fn api_id() -> &'static str {
        "getus"
    }

    #[inline]
    pub async fn new(pool: &sqlx::PgPool) -> Result<Self, AppError> {
        Ok(Self(ApiClient::new(pool, Self::api_id().to_string(), "X-API-Key").await?))
    }

    pub async fn place_order(&self, order: GetusCreateOrderReq) -> Result<GetusCreateOrderRes, AppError> {
        let res = self.0.client
            .post(format!("{}/wp-json/ddm/v1/order", self.0.api_provider.url))
            .json(&order)
            .send()
            .await?;

        println!("[api_providers::getus_site::place_order()] Response {:?}", res);

        Ok(serde_json::from_value(res.json().await?)?)
    }

    pub async fn check_order_status(&self, order: u32) -> Result<(), AppError> {
        let res = self.0.client
            .get(format!("{}/wp-json/ddm/v1/order-status?order_id={}", self.0.api_provider.url, order))
            .json(&order)
            .send()
            .await?;

        println!("[api_providers::getus_site::check_order_status()] Response {:?}", res);

        Ok(serde_json::from_value(res.json().await?)?)
    }
}