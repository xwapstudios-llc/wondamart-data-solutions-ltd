use serde::{Serialize, Deserialize, Serializer, Deserializer};
use sqlx::types::{BigDecimal, JsonValue};
use sqlx::PgPool;
use sqlx::Row;
use sqlx::{Decode, Encode, Postgres};
use time::OffsetDateTime;
use crate::db_model::{Commission, DBModel};
use crate::error::AppError;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum NetworkType {
    Mtn,
    Telecel,
    Airteltigo,
}

impl NetworkType {
    pub fn as_str(&self) -> &'static str {
        match self {
            NetworkType::Mtn => "mtn",
            NetworkType::Telecel => "telecel",
            NetworkType::Airteltigo => "airteltigo",
        }
    }

    pub fn from_str(s: &str) -> Result<Self, String> {
        match s {
            "mtn" => Ok(NetworkType::Mtn),
            "telecel" => Ok(NetworkType::Telecel),
            "airteltigo" => Ok(NetworkType::Airteltigo),
            _ => Err(format!("Unknown network type: {}", s)),
        }
    }
}

#[derive(Debug, sqlx::FromRow)]
pub struct DataBundle {
    pub id: String,
    pub network_str: String,
    pub name: Option<String>,
    pub cost_price: JsonValue,
    pub selling_price: Option<BigDecimal>,
    pub api_id: Option<String>,
    pub data_amount: i32,
    pub minutes: Option<i32>,
    pub sms: Option<i32>,
    pub validity_period: i32,
    pub commission: Option<BigDecimal>,
    pub enabled: bool,
    pub created_at: Option<OffsetDateTime>,
    pub updated_at: Option<OffsetDateTime>,
}

impl DBModel for DataBundle {
    type IdType = String;

    async fn from_db(pool: &PgPool, id: Self::IdType) -> Result<Self, AppError> {
        let bundle = sqlx::query_as!(
            DataBundle,
            r#"
            SELECT id, network as "network_str: _", name, cost_price, selling_price, api_id, data_amount, minutes, sms, validity_period, commission, enabled, created_at, updated_at
            FROM data_bundles
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
            UPDATE data_bundles
            SET name = $2, cost_price = $3, selling_price = $4, api_id = $5, commission = $6, enabled = $7, updated_at = NOW()
            WHERE id = $1
            "#,
            self.id,
            self.name,
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
            INSERT INTO data_bundles (id, network, name, cost_price, selling_price, api_id, data_amount, minutes, sms, validity_period, commission, enabled)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id
            "#
        )
        .bind(self.id)
        .bind(&self.network_str)
        .bind(&self.name)
        .bind(&self.cost_price)
        .bind(&self.selling_price)
        .bind(&self.api_id)
        .bind(self.data_amount)
        .bind(self.minutes)
        .bind(self.sms)
        .bind(self.validity_period)
        .bind(&self.commission)
        .bind(self.enabled)
        .fetch_one(pool)
        .await?;

        Ok(row.get::<String, _>("id"))
    }
}


impl Serialize for DataBundle {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer
    {
        todo!()
    }
}
impl<'de> Deserialize<'de> for DataBundle {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>
    {
        todo!()
    }
}

impl DataBundle {
    pub fn network(&self) -> Result<NetworkType, String> {
        NetworkType::from_str(&self.network_str)
    }

    pub fn set_network(&mut self, network: NetworkType) {
        self.network_str = network.as_str().to_string();
    }
}
