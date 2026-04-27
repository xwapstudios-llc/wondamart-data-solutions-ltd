use axum::http::StatusCode;
use axum::Json;
use serde::{Deserialize, Serialize};
use crate::error::AppError;

#[derive(Debug, Serialize, Deserialize)]
pub struct RouteResponse<T> where T: Serialize {
    status_code: u16,
    message: Option<String>,
    data: T
}

pub type RouteResponseJson<T> = Result<Json<RouteResponse<T>>, AppError>;

impl<T> RouteResponse<T> where T: Serialize {
    #[inline]
    pub(crate) fn new_(status_code: u16, data: T, message: Option<String>) -> Self {
        Self { status_code, message, data }
    }
    #[inline]
    pub(crate) fn new(status_code: StatusCode, data: T, message: Option<String>) -> Self {
        Self {
            status_code: status_code.as_u16(),
            message,
            data
        }
    }
    pub(crate) fn new_ok(data: T, message: Option<String>) -> Self {
        Self {
            status_code: StatusCode::OK.as_u16(),
            message,
            data
        }
    }
    #[inline]
    pub(crate) fn json_result(self) -> RouteResponseJson<T> {
        println!("Sending response: {}", serde_json::to_string_pretty(&self)?);
        Ok(Json(self))
    }
}
