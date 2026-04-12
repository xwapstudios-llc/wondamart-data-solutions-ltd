use std::time::Duration;
use axum::http::header;
use reqwest::Client;
use crate::db_model::{ApiProvider, DBModel};
use crate::error::AppError;

pub(super) struct ApiClient {
    pub(crate) client: Client,
    pub(crate) api_provider: ApiProvider
}

impl ApiClient {
    pub async fn new(pool : &sqlx::PgPool, api_provider_id: String, api_key_header: &'static str) ->  Result<Self, AppError> {
        let provider = ApiProvider::from_db(pool, api_provider_id).await?;

        let mut headers = header::HeaderMap::new();

        if let Ok(mut auth_value) = header::HeaderValue::from_str(provider.api_key.as_str()) {
            auth_value.set_sensitive(true);
            headers.insert(api_key_header, auth_value);

            let client = Client::builder()
                .default_headers(headers)
                .timeout(Duration::from_secs(provider.timeout_seconds as u64))
                .build();
            if let Ok(client) = client {
                return Ok(Self { client, api_provider: provider });
            };
        }

        Err(AppError::Internal(format!(
            "Failed to create {} API client with the api key {:?}",
            provider.name,
            provider.api_key
        )))
    }
}