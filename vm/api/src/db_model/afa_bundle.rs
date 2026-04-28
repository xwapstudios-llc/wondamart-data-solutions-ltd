use crate::db_model::DBModel;
use crate::error::AppError;
use serde::ser::SerializeStruct;
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use sqlx::types::{BigDecimal, JsonValue};
use sqlx::{PgPool, Row};
use time::OffsetDateTime;


#[derive(Debug, sqlx::FromRow)]
pub struct AFABundle {
    pub id: String,
    pub cost_price: JsonValue, // A list of key value pairs of api_provider : cost
    pub selling_price: BigDecimal,
    pub api_id: String,
    pub commission: BigDecimal,
    pub enabled: bool,
    pub created_at: Option<OffsetDateTime>,
    pub updated_at: Option<OffsetDateTime>,
}

impl DBModel for AFABundle {
    type IdType = String;

    async fn from_db(pool: &PgPool, id: Self::IdType) -> Result<Self, AppError> {
        let bundle = sqlx::query_as!(
            AFABundle,
            r#"
            SELECT *
            FROM afa_bundle
            WHERE id = $1
            "#,
            id
        )
            .fetch_one(pool)
            .await?;

        Ok(bundle)
    }

    async fn update_db(self, pool: &PgPool) -> Result<(), AppError> {
        sqlx::query!(
            r#"
            UPDATE afa_bundle
            SET cost_price = $2, selling_price = $3, api_id = $4, commission = $5, enabled = $6, updated_at = NOW()
            WHERE id = $1
            "#,
            self.id,
            self.cost_price,
            self.selling_price,
            self.api_id,
            self.commission,
            self.enabled,
        )
            .execute(pool)
            .await?;

        Ok(())
    }

    async fn new_db_entry(self, pool: &PgPool) -> Result<Self::IdType, AppError> {
        let row = sqlx::query(
            r#"
            INSERT INTO afa_bundle (id, cost_price, selling_price, api_id, commission, enabled)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            "#
        )
            .bind(self.id)
            .bind(&self.cost_price)
            .bind(&self.selling_price)
            .bind(&self.api_id)
            .bind(&self.commission)
            .bind(self.enabled)
            .fetch_one(pool)
            .await?;

        Ok(row.get::<String, _>("id"))
    }
}

impl Serialize for AFABundle {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("AFABundle", 5)?;
        state.serialize_field("id", &self.id)?;
        state.serialize_field("cost_price", &self.cost_price)?;
        state.serialize_field("selling_price", &self.selling_price.to_plain_string())?;
        state.serialize_field("api_id", &self.api_id)?;
        state.serialize_field("commission", &self.commission.to_plain_string())?;
        state.end()
    }
}

impl<'de> Deserialize<'de> for AFABundle {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        #[derive(Deserialize)]
        struct Raw {
            id: String,
            cost_price: JsonValue,
            selling_price: String,
            api_id: String,
            commission: String,
            enabled: bool,
            created_at: Option<OffsetDateTime>,
            updated_at: Option<OffsetDateTime>,
        }
        let raw = Raw::deserialize(deserializer)?;
        Ok(AFABundle {
            id: raw.id,
            cost_price: raw.cost_price,
            selling_price: BigDecimal::parse_bytes(raw.selling_price.as_bytes(), 10)
                .ok_or_else(|| serde::de::Error::custom("invalid selling_price"))?,
            api_id: raw.api_id,
            commission: BigDecimal::parse_bytes(raw.commission.as_bytes(), 10)
                .ok_or_else(|| serde::de::Error::custom("invalid commission"))?,
            enabled: raw.enabled,
            created_at: raw.created_at,
            updated_at: raw.updated_at,
        })
    }
}
