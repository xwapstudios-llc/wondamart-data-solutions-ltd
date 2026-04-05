use axum::Json;
use chrono::{DateTime, Utc};
use serde::Serialize;
use crate::error::AppError;

#[derive(Serialize)]
pub struct HomeResponse {
    service: String,
    status: String,
    timestamp: String,
}

// #[derive(Serialize)]
// struct ApiResponse<T> {
//     status: String,
//     message: String,
//     data: Option<T>,
// }

pub
async fn home() -> Result<Json<HomeResponse>, AppError> {
    let timestamp: DateTime<Utc> = Utc::now();
    Ok(Json(HomeResponse {
        service: "Wondamart API".to_string(),
        status: "running".to_string(),
        timestamp: timestamp.to_rfc3339(),
    }))
}