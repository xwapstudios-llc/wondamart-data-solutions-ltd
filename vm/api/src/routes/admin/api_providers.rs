use crate::db_model::{ApiProvider, DBModel};
use crate::error::AppError;
use crate::routes::{RouteResponse, RouteResponseJson};
use axum::Json;
use axum::extract::{Query, State};
use serde::Deserialize;
use sqlx::types::JsonValue;
use zod_rs::Schema;
use crate::app::AppState;

#[derive(Deserialize, Debug)]
pub struct AdminApiProviderGetReq {
    pub api_id: String,
}

/// Get an api provider
pub async fn get(
    State(app): State<AppState>,
    Query(payload): Query<AdminApiProviderGetReq>,
) -> RouteResponseJson<ApiProvider> {
    println!("[routes::admin::api_providers::get] request...");

    println!(
        "[AdminApiProviderGetReq] Admin request received, {:?}",
        payload
    );

    let api_provider = ApiProvider::from_db(app.pool_ref(), payload.api_id).await?;

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
            .field("api_id", zod_rs::string().min(2).max(50))
            .field("name", zod_rs::string().min(2).max(255))
            .field("url", zod_rs::string().url())
            .optional_field("purpose", zod_rs::string().min(2).max(255))
            .field("api_key", zod_rs::string().min(2).max(255))
            .optional_field("secret_key", zod_rs::string().min(2).max(255))
            .optional_field("webhook_url", zod_rs::string().url())
            .optional_field("is_active", zod_rs::boolean())
            .optional_field("timeout_seconds", zod_rs::number().min(2.0).positive().int())
            .optional_field("configuration", zod_rs::object());

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
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<ApiProvider> {
    println!("[routes::admin::api_providers::post] request...");

    println!(
        "[AdminApiProviderPostReq] Admin request received, {:?}",
        payload
    );

    let payload = AdminApiProviderPostReq::validate_and_parse(&payload)?;
    let api_id = ApiProvider::new_db_entry(payload.into(), app.pool_ref()).await?;
    let res = ApiProvider::from_db(app.pool_ref(), api_id).await?;

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
        println!("Before creating the schemas...");
        let schemas = zod_rs::object()
            .field("api_id", zod_rs::string().min(2).max(50))
            .optional_field("name", zod_rs::string().min(2).max(255))
            .optional_field("url", zod_rs::string().url())
            .optional_field("purpose", zod_rs::string().min(2).max(255))
            .optional_field("api_key", zod_rs::string().min(2).max(255))
            .optional_field("secret_key", zod_rs::string().min(2).max(255))
            .optional_field("webhook_url", zod_rs::string().url())
            .optional_field("is_active", zod_rs::boolean())
            .optional_field("timeout_seconds", zod_rs::number().min(2.0).positive().int())
            .optional_field("configuration", zod_rs::object())
            ;

        println!("Before zod safe parse and validate...");
        let parsed = schemas.safe_parse(value)?;
        println!("[AdminApiProviderPutReq::validate_and_parse()] after zod parsed = {}", parsed);
        Ok(serde_json::from_value(parsed)?)
    }

    async fn into_api_provider(self, pool: &sqlx::PgPool) -> Result<ApiProvider, AppError> {
        let prev = ApiProvider::from_db(pool, self.api_id.clone()).await?;
        let get = |main: Option<String>, prev: Option<String>| match main {
            None => prev,
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
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<ApiProvider> {
    println!("[routes::admin::api_providers::put] request...");

    println!(
        "[AdminApiProviderPutReq] Admin request received, {:?}",
        payload
    );

    println!("Before parse and validate...");
    let payload = AdminApiProviderPutReq::validate_and_parse(&payload)?;
    let api_id = payload.api_id.clone();

    let shim = payload.into_api_provider(app.pool_ref()).await?;
    shim.update_db(app.pool_ref()).await?;

    RouteResponse::new_ok(ApiProvider::from_db(app.pool_ref(), api_id).await?, None).json_result()
}

/// Delete an api provider
pub async fn delete(
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<()> {
    println!("[routes::admin::api_providers::delete] request...");

    println!(
        "[AdminApiProviderDeleteReq] Admin request received, {:?}",
        payload
    );

    let payload: AdminApiProviderGetReq = serde_json::from_value(payload)?;
    ApiProvider::delete_db(app.pool_ref(), payload.api_id).await?;

    RouteResponse::new_ok(
        (),
        Some("Api provider has been deleted successfully".to_string()),
    )
    .json_result()
}
