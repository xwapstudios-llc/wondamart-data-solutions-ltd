use zod_rs::Schema;
use std::sync::Arc;
use axum::extract::State;
use axum::Json;
use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;
use zod_rs::prelude::ZodSchema;
use crate::error::AppError;



#[derive(Deserialize, Serialize, Debug, ZodSchema)]
struct GuestBuyPostReq {
    #[zod(min_length(2), max_length(255))]
    pub store_id: String,

    #[zod(min_length(2), max_length(255))]
    pub bundle_id: String,

    #[zod(regex(r"^(0|\+233|233)[25][0-9]{8}$"))]
    pub phone_number: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GuestBuyPostRes{}

pub async fn post(
    State(pool): State<Arc<sqlx::PgPool>>,
    Json(payload): Json<JsonValue>,
) -> Result<Json<GuestBuyPostRes>, AppError> {
    let payload = GuestBuyPostReq::validate_and_parse(&payload)?;

    // Implementation

    let res = GuestBuyPostRes {};
    Ok(Json(res))
}