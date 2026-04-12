use serde::{Serialize, Deserialize};
use sqlx::PgPool;
use sqlx::Row;
use sqlx::types::JsonValue;
use time::OffsetDateTime;
use crate::db_model::DBModel;
use crate::error::AppError;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct AgentStore {
    pub store_id: String,
    pub agent_id: i32,
    pub name: String,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub is_phone_on_whatsapp: Option<bool>,
    pub bundles: JsonValue,
    pub is_active: bool,
    pub opening_time: Option<OffsetDateTime>,
    pub closing_time: Option<OffsetDateTime>,
    pub created_at: Option<OffsetDateTime>,
    pub updated_at: Option<OffsetDateTime>,
}

impl DBModel for AgentStore {
    type IdType = String;

    async fn from_db(pool: &PgPool, id: Self::IdType) -> Result<Self, AppError> {
        let store = sqlx::query_as!(
            AgentStore,
            r#"
            SELECT store_id, agent_id, name, email, phone_number, is_phone_on_whatsapp, bundles, is_active, opening_time, closing_time, created_at, updated_at
            FROM agent_stores
            WHERE store_id = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await?;

        Ok(store)
    }

    async fn update_db(self, pool: &PgPool) -> Result<(), AppError> {
        sqlx::query!(
            r#"
            UPDATE agent_stores
            SET name = $2, email = $3, phone_number = $4, is_phone_on_whatsapp = $5, bundles = $6, is_active = $7, opening_time = $8, closing_time = $9, updated_at = NOW()
            WHERE store_id = $1
            "#,
            self.store_id,
            self.name,
            self.email,
            self.phone_number,
            self.is_phone_on_whatsapp,
            self.bundles,
            self.is_active,
            self.opening_time,
            self.closing_time
        )
        .execute(pool)
        .await?;

        Ok(())
    }

    async fn new_db_entry(self, pool: &PgPool) -> Result<Self::IdType, AppError> {
        let record = sqlx::query!(
            r#"
            INSERT INTO agent_stores (store_id, agent_id, name, email, phone_number, is_phone_on_whatsapp, bundles, is_active, opening_time, closing_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING store_id
            "#,
            self.store_id,
            self.agent_id,
            self.name,
            self.email,
            self.phone_number,
            self.is_phone_on_whatsapp,
            self.bundles,
            self.is_active,
            self.opening_time,
            self.closing_time
        )
        .fetch_one(pool)
        .await?;

        Ok(record.store_id)
    }
}