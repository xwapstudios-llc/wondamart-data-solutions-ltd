use axum::extract::State;
use axum::Json;
use serde::Deserialize;
use sqlx::types::JsonValue;
use zod_rs::Schema;
use crate::app::AppState;
use crate::error::AppError;
use crate::routes::{RouteResponse, RouteResponseJson};

#[derive(Debug, Deserialize)]
struct UserDataBundlePutReq {
    phone: String,
    bundle_id: String,
}
impl UserDataBundlePutReq {
    pub fn validate_and_parse(value: &JsonValue) -> Result<Self, AppError> {
        let schemas = zod_rs::object()
            .field("phone", zod_rs::string().regex(r"^(0|\+233|233)[25][0-9]{8}$"))
            .field("bundle_id", zod_rs::string().min(2).max(255));
        Ok(serde_json::from_value(schemas.safe_parse(value)?)?)
    }
}

pub async fn put(
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<()> {
    println!("[routes::user::data_bundle::put] Request received. {}", payload);
    
    let payload = UserDataBundlePutReq::validate_and_parse(&payload)?;

    app.bundle_service.new_bundle(payload.bundle_id, payload.phone).await?;

    RouteResponse::new_ok((), Some("Bundle placed successfully".into())).json_result()
}