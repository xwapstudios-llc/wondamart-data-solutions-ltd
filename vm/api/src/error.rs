use crate::routes::{RouteResponse};
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;
use sqlx::migrate::MigrateError;
use zod_rs_util::ValidationResult;

#[derive(Debug)]
pub enum AppError {
    DbError(sqlx::Error),
    BadRequest(String),
    ValidationError(ValidationResult),
    Internal(String),
    InsufficientBalance,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

impl From<ValidationResult> for AppError {
    fn from(value: ValidationResult) -> Self {
        AppError::ValidationError(value)
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::DbError(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Database error".to_string(),
            ),
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::ValidationError(err) => (StatusCode::BAD_REQUEST, err.to_string()),
            AppError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
            AppError::InsufficientBalance => (StatusCode::BAD_REQUEST, "Insufficient balance".into()),
        };

        let body = RouteResponse::new(status, (), Some(message)).json_result();
        (status, body).into_response()
    }
}

impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        if let sqlx::Error::Database(db_err) = &err {
            if let Some(message) = db_err.constraint() {
                return match message {
                    "users_email_key" => AppError::BadRequest("Email already exists".into()),
                    "users_phone_number_key" => {
                        AppError::BadRequest("Phone number already exists".into())
                    }
                    &_ => AppError::DbError(err),
                };
            }
        }

        AppError::DbError(err)
    }
}

impl From<reqwest::Error> for AppError {
    fn from(err: reqwest::Error) -> Self {
        Self::Internal(err.to_string())
    }
}

impl From<serde_json::Error> for AppError {
    fn from(err: serde_json::Error) -> Self {
        Self::Internal(err.to_string())
    }
}

impl From<MigrateError> for AppError {
    fn from(err: MigrateError) -> Self {
        Self::Internal(err.to_string())
    }
}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        Self::Internal(err.to_string())
    }
}
