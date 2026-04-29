use core::str::FromStr;
use axum::extract::{Query, State};
use axum::Json;
use serde::{Deserialize, Serialize};
use sqlx::types::{JsonValue};
use time::OffsetDateTime;
use zod_rs::Schema;
use crate::app::AppState;
use crate::db_model::{DataBundle, NetworkType};
use crate::error::AppError;
use crate::routes::{RouteResponse, RouteResponseJson};

#[derive(Debug, Deserialize)]
struct UserDataBundlePostReq {
    phone: String,
    bundle_id: String,
}
impl UserDataBundlePostReq {
    pub fn validate_and_parse(value: &JsonValue) -> Result<Self, AppError> {
        let schemas = zod_rs::object()
            .field("phone", zod_rs::string().regex(r"^(0|\+233|233)[25][0-9]{8}$"))
            .field("bundle_id", zod_rs::string().min(2).max(255));
        Ok(serde_json::from_value(schemas.safe_parse(value)?)?)
    }
}

/// Purchase a new data bundle
pub async fn post(
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<()> {
    println!("[routes::user::data_bundle::put] Request received. {}", payload);
    
    let payload = UserDataBundlePostReq::validate_and_parse(&payload)?;

    app.bundle_service.lock().await.new_bundle(app.tx_service.clone(), crate::db_model::TransactionSource::Agent, 0, payload.bundle_id, payload.phone).await?;

    RouteResponse::new_ok((), Some("Bundle placed successfully".into())).json_result()
}


#[derive(Deserialize)]
pub struct UserDataBundleReq {
    network: Option<NetworkType>,
    bundle_id: Option<String>,
    validity: Option<i32>,
    enabled: Option<bool>,
}
#[derive(Serialize)]
pub struct UserDataBundle {
    network: NetworkType,
    id: String,
    name: Option<String>,
    price: f32,
    commission: f32,
    data: i32,
    minutes: Option<i32>,
    sms: Option<i32>,
    validity: i32,
    enabled: bool,
    created_at: String,
    updated_at: String,
}
impl From<DataBundle> for UserDataBundle {
    fn from(bundle: DataBundle) -> Self {
        Self {
            network: bundle.network,
            id: bundle.id,
            name: bundle.name,
            price: f32::from_str(bundle.selling_price.to_plain_string().as_str()).unwrap_or(0.0),
            commission: f32::from_str(bundle.commission.to_plain_string().as_str()).unwrap_or(0.0),
            data: bundle.data_amount,
            minutes: bundle.minutes,
            sms: bundle.sms,
            validity: bundle.validity_period,
            enabled: bundle.enabled,
            created_at: bundle.created_at.unwrap_or(OffsetDateTime::now_utc()).to_string(),
            updated_at: bundle.updated_at.unwrap_or(OffsetDateTime::now_utc()).to_string(),
        }
    }
}

pub async fn get(
    State(app): State<AppState>,
    Query(payload): Query<UserDataBundleReq>,
) -> RouteResponseJson<Vec<UserDataBundle>> {
    println!("[routes::user::data_bundle::get] Request received.");

    let mut query = sqlx::query_builder::QueryBuilder::new(r#"SELECT * FROM data_bundles"#);

    if let Some(network) = payload.network {
        query.push(" WHERE network = ");
        query.push_bind(network.as_str());
    }

    if let Some(bundle_id) = payload.bundle_id {
        query.push(" AND id = ");
        query.push_bind(bundle_id);
    }

    if let Some(validity) = payload.validity {
        query.push(" AND validity_period = ");
        query.push_bind(validity);
    }

    if let Some(enabled) = payload.enabled {
        query.push(" AND enabled = ");
        query.push_bind(enabled);
    }

    let bundles: Vec<DataBundle> = query.build_query_as().fetch_all(&*app.pool).await?;

    let bundles: Vec<UserDataBundle> = bundles.into_iter().map(|b| b.into()).collect();

    RouteResponse::new_ok(bundles, None).json_result()
}
