use axum::extract::State;
use axum::Json;
use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;
use zod_rs::Schema;
use crate::app::AppState;
use crate::db_model::TransactionSource;
use crate::error::AppError;
use crate::routes::{RouteResponse, RouteResponseJson};

#[derive(Serialize, Deserialize, Debug)]
pub struct AFABundlePostReq {
    pub full_name: String,
    pub ghana_card: String,
    pub occupation: String,
    pub contact: String,
    pub location: String,
}
impl AFABundlePostReq {
    pub fn validate_and_parse(value: &JsonValue) -> Result<Self, AppError> {
        let schemas = zod_rs::object()
            .field("full_name", zod_rs::string())
            .field("occupation", zod_rs::string())
            .field("contact", zod_rs::string().regex(r"^(0|\+233|233)[25][0-9]{8}$"))
            .field("location", zod_rs::string())
            .field("ghana_card", zod_rs::string().regex(r"^(GHA)-[0-9]{9}-[0-9]{1}$"));
        Ok(serde_json::from_value(schemas.safe_parse(value)?)?)
    }
}

pub async fn post(
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<()> {
    let payload = AFABundlePostReq::validate_and_parse(&payload)?;

    app.bundle_service.lock().await.new_afa_bundle_service(app.tx_service.clone(), TransactionSource::Agent, 0, payload.full_name, payload.ghana_card, payload.occupation, payload.contact, payload.location).await?;
    RouteResponse::new_ok((), Some("Afa bundle created successfully...".to_string())).json_result()
}
