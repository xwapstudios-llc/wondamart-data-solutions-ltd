use zod_rs::Schema;
use std::sync::Arc;
use axum::extract::State;
use axum::Json;
use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;
use zod_rs::prelude::ZodSchema;
use crate::error::AppError;



#[derive(Deserialize, Serialize, Debug, ZodSchema)]
struct GuestTrackGetReq {
    #[zod(min_length(2), max_length(255))]
    pub store_id: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GuestTrackGetRes{}

pub async fn get(
    State(pool): State<Arc<sqlx::PgPool>>,
    Json(payload): Json<JsonValue>,
) -> Result<Json<GuestTrackGetRes>, AppError> {
    let payload = GuestTrackGetReq::validate_and_parse(&payload)?;

    // Implementation

    let res = GuestTrackGetRes {};
    Ok(Json(res))
}