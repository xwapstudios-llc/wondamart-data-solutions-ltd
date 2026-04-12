use serde::{Serialize, Deserialize};
use sqlx::types::JsonValue;
use sqlx::PgPool;
use time::OffsetDateTime;
use crate::db_model::DBModel;
use crate::error::AppError;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct ApiProvider {
    pub api_id: String,
    pub name: String,
    pub url: Option<String>,
    pub purpose: String,
    pub api_key: Option<String>,
    pub secret_key: Option<String>,
    pub webhook_url: Option<String>,
    pub is_active: bool,
    pub timeout_seconds: Option<i32>,
    pub configuration: JsonValue,
    pub created_at: Option<OffsetDateTime>,
    pub updated_at: Option<OffsetDateTime>,
}

impl DBModel for ApiProvider {
    type IdType = String;

    async fn from_db(pool: &PgPool, id: Self::IdType) -> Result<Self, AppError> {
        let provider = sqlx::query_as!(
            ApiProvider,
            r#"
            SELECT api_id, name, url, purpose, api_key, secret_key, webhook_url, is_active, timeout_seconds, configuration, created_at, updated_at
            FROM api_providers
            WHERE api_id = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await?;

        Ok(provider)
    }

    async fn update_db(&self, pool: &PgPool) -> Result<(), AppError> {
        sqlx::query!(
            r#"
            UPDATE api_providers
            SET name = $2, url = $3, purpose = $4, api_key = $5, secret_key = $6, webhook_url = $7, is_active = $8, timeout_seconds = $9, configuration = $10, updated_at = NOW()
            WHERE api_id = $1
            "#,
            self.api_id,
            self.name,
            self.url,
            self.purpose,
            self.api_key,
            self.secret_key,
            self.webhook_url,
            self.is_active,
            self.timeout_seconds,
            self.configuration
        )
        .execute(pool)
        .await?;

        Ok(())
    }

    async fn new_db_entry(self, pool: &PgPool) -> Result<Self::IdType, AppError> {
        let record = sqlx::query!(
            r#"
            INSERT INTO api_providers (api_id, name, url, purpose, api_key, secret_key, webhook_url, is_active, timeout_seconds, configuration)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING api_id
            "#,
            self.api_id,
            self.name,
            self.url,
            self.purpose,
            self.api_key,
            self.secret_key,
            self.webhook_url,
            self.is_active,
            self.timeout_seconds,
            self.configuration
        )
        .fetch_one(pool)
        .await?;

        Ok(record.api_id)
    }
}
