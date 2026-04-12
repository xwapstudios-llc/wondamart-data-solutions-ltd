use crate::db_model::{ApiProvider, DBModel};
use crate::error::AppError;
use crate::routes::{RouteResponse, RouteResponseJson};
use axum::Json;
use axum::extract::State;
use serde::Deserialize;
use sqlx::types::JsonValue;
use std::sync::Arc;
use zod_rs::Schema;

#[derive(Deserialize, Debug)]
pub struct AdminApiProviderGetReq {
    pub api_id: String,
}

impl AdminApiProviderGetReq {
    pub fn validate_and_parse(value: &JsonValue) -> Result<Self, AppError> {
        let schemas = zod_rs::object().field("api_id", zod_rs::string().min(2).max(255));
        Ok(serde_json::from_value(schemas.safe_parse(value)?)?)
    }
}

/// Get an api provider
pub async fn get(
    State(pool): State<Arc<sqlx::PgPool>>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<ApiProvider> {
    println!("[routes::admin::api_providers::get] request...");

    println!(
        "[AdminApiProviderGetReq] Admin request received, {:?}",
        payload
    );

    let payload = AdminApiProviderGetReq::validate_and_parse(&payload)?;
    let api_provider = ApiProvider::from_db(&pool, payload.api_id).await?;

    RouteResponse::new_ok(api_provider, None).json_result()
}

#[derive(Deserialize, Debug)]
pub struct AdminApiProviderPostReq {
    pub api_id: String,
    pub name: String,
    pub url: String,
    pub purpose: String,
    pub api_key: String,
    pub secret_key: Option<String>,
    pub webhook_url: Option<String>,
    pub is_active: bool,
    pub timeout_seconds: Option<i32>,
    pub configuration: JsonValue,
}
impl AdminApiProviderPostReq {
    pub fn validate_and_parse(value: &JsonValue) -> Result<Self, AppError> {
        let schemas = zod_rs::object()
            .field("api_id", zod_rs::string().min(2).max(255))
            .field("name", zod_rs::string().min(2).max(255))
            .field("url", zod_rs::string().url())
            .field("purpose", zod_rs::string().min(2).max(255).optional())
            .field("api_key", zod_rs::string().min(2).max(255))
            .field("secret_key", zod_rs::string().min(2).max(255).optional())
            .field("webhook_url", zod_rs::string().url().optional())
            .field("is_active", zod_rs::boolean().optional())
            .field(
                "timeout_seconds",
                zod_rs::number().min(2.0).positive().int().optional(),
            )
            .field("configuration", zod_rs::object().optional());

        Ok(serde_json::from_value(schemas.safe_parse(value)?)?)
    }
}
impl Into<ApiProvider> for AdminApiProviderPostReq {
    fn into(self) -> ApiProvider {
        ApiProvider {
            api_id: self.api_id,
            name: self.name,
            url: self.url,
            purpose: self.purpose,
            api_key: self.api_key,
            secret_key: self.secret_key,
            webhook_url: self.webhook_url,
            is_active: self.is_active,
            timeout_seconds: self.timeout_seconds.unwrap_or(30),
            configuration: self.configuration,
            created_at: None,
            updated_at: None,
        }
    }
}

/// Create a new api provider
pub async fn post(
    State(pool): State<Arc<sqlx::PgPool>>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<ApiProvider> {
    println!("[routes::admin::api_providers::post] request...");

    println!(
        "[AdminApiProviderPostReq] Admin request received, {:?}",
        payload
    );

    let payload = AdminApiProviderPostReq::validate_and_parse(&payload)?;
    let api_id = ApiProvider::new_db_entry(payload.into(), &pool).await?;
    let res = ApiProvider::from_db(&pool, api_id).await?;

    RouteResponse::new_ok(res, None).json_result()
}

#[derive(Deserialize, Debug)]
pub struct AdminApiProviderPutReq {
    pub api_id: String,
    pub name: Option<String>,
    pub url: Option<String>,
    pub purpose: Option<String>,
    pub api_key: Option<String>,
    pub secret_key: Option<String>,
    pub webhook_url: Option<String>,
    pub is_active: Option<bool>,
    pub timeout_seconds: Option<i32>,
    pub configuration: Option<JsonValue>,
}
impl AdminApiProviderPutReq {
    pub fn validate_and_parse(value: &JsonValue) -> Result<Self, AppError> {
        let schemas = zod_rs::object()
            .field("api_id", zod_rs::string().min(2).max(255))
            .field("name", zod_rs::string().min(2).max(255).optional())
            .field("url", zod_rs::string().url().optional())
            .field("purpose", zod_rs::string().min(2).max(255).optional())
            .field("api_key", zod_rs::string().min(2).max(255).optional())
            .field("secret_key", zod_rs::string().min(2).max(255).optional())
            .field("webhook_url", zod_rs::string().url().optional())
            .field("is_active", zod_rs::boolean().optional())
            .field(
                "timeout_seconds",
                zod_rs::number().min(2.0).positive().int().optional(),
            )
            .field("configuration", zod_rs::object().optional());

        Ok(serde_json::from_value(schemas.safe_parse(value)?)?)
    }

    async fn into_api_provider(self, pool: &sqlx::PgPool) -> Result<ApiProvider, AppError> {
        let prev = ApiProvider::from_db(&pool, self.api_id.clone()).await?;
        let get = |main: Option<String>, prev: Option<String>| match main {
            None => match prev {
                None => None,
                Some(s_key) => Some(s_key),
            },
            Some(s_key) => Some(s_key),
        };

        Ok(ApiProvider {
            api_id: self.api_id,
            name: self.name.unwrap_or(prev.name),
            url: self.url.unwrap_or(prev.url),
            purpose: self.purpose.unwrap_or(prev.purpose),
            api_key: self.api_key.unwrap_or(prev.api_key),
            secret_key: get(self.secret_key, prev.secret_key),
            webhook_url: get(self.webhook_url, prev.webhook_url),
            is_active: self.is_active.unwrap_or(prev.is_active),
            timeout_seconds: self.timeout_seconds.unwrap_or(prev.timeout_seconds),
            configuration: self.configuration.unwrap_or(prev.configuration),
            created_at: prev.created_at,
            updated_at: prev.updated_at,
        })
    }
}

/// Update an api provider
pub async fn put(
    State(pool): State<Arc<sqlx::PgPool>>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<ApiProvider> {
    println!("[routes::admin::api_providers::put] request...");

    println!(
        "[AdminApiProviderPutReq] Admin request received, {:?}",
        payload
    );

    let payload = AdminApiProviderPutReq::validate_and_parse(&payload)?;
    let api_id = payload.api_id.clone();

    let shim = payload.into_api_provider(&pool).await?;
    shim.update_db(&pool).await?;

    RouteResponse::new_ok(ApiProvider::from_db(&pool, api_id).await?, None).json_result()
}

/// Delete an api provider
pub async fn delete(
    State(pool): State<Arc<sqlx::PgPool>>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<()> {
    println!("[routes::admin::api_providers::delete] request...");

    println!(
        "[AdminApiProviderDeleteReq] Admin request received, {:?}",
        payload
    );

    let payload = AdminApiProviderGetReq::validate_and_parse(&payload)?;
    ApiProvider::delete_db(&pool, payload.api_id).await?;

    RouteResponse::new_ok(
        (),
        Some("Api provider has been deleted successfully".to_string()),
    )
    .json_result()
}
