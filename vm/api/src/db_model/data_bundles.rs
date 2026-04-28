use serde::{Serialize, Deserialize, Serializer, Deserializer};
use serde::ser::SerializeStruct;
use sqlx::types::{BigDecimal, JsonValue};
use sqlx::{Database, PgPool, Type};
use sqlx::Row;
use sqlx::{Decode, Encode, Postgres};
use sqlx::error::BoxDynError;
use sqlx::postgres::PgTypeInfo;
use time::OffsetDateTime;
use crate::db_model::{Commission, DBModel};
use crate::error::AppError;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum NetworkType {
    #[serde(rename = "mtn")]
    Mtn,
    #[serde(rename = "telecel")]
    Telecel,
    #[serde(rename = "airteltigo")]
    Airteltigo,
}
impl Type<Postgres> for NetworkType {
    #[inline]
    fn type_info() -> <Postgres as Database>::TypeInfo {
        PgTypeInfo::with_name("network_type")
    }
}
impl Decode<'_, Postgres> for NetworkType {
    #[inline]
    fn decode(value: <Postgres as Database>::ValueRef<'_>) -> Result<Self, BoxDynError> {
        let s = <&str as Decode<Postgres>>::decode(value)?;
        Ok(Self::from_str(s)?)
    }
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
    pub network: NetworkType,
    pub name: Option<String>,
    pub cost_price: JsonValue, // A list of key value pairs of api_provider : cost
    pub selling_price: BigDecimal,
    pub api_id: String,
    pub data_amount: i32,
    pub minutes: Option<i32>,
    pub sms: Option<i32>,
    pub validity_period: i32,
    pub commission: BigDecimal,
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
            SELECT id, network as "network: _", name, cost_price, selling_price, api_id, data_amount, minutes, sms, validity_period, commission, enabled, created_at, updated_at
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
        .bind(&self.network.as_str())
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
        let mut state = serializer.serialize_struct("DataBundle", 14)?;
        state.serialize_field("id", &self.id)?;
        state.serialize_field("network", &self.network.as_str())?;
        state.serialize_field("name", &self.name)?;
        state.serialize_field("cost_price", &self.cost_price)?;
        state.serialize_field("selling_price", &self.selling_price.to_plain_string())?;
        state.serialize_field("api_id", &self.api_id)?;
        state.serialize_field("data_amount", &self.data_amount)?;
        state.serialize_field("minutes", &self.minutes)?;
        state.serialize_field("sms", &self.sms)?;
        state.serialize_field("validity_period", &self.validity_period)?;
        state.serialize_field("commission", &self.commission.to_plain_string())?;
        state.serialize_field("enabled", &self.enabled)?;
        state.serialize_field("created_at", &self.created_at)?;
        state.serialize_field("updated_at", &self.updated_at)?;
        state.end()
    }
}
impl<'de> Deserialize<'de> for DataBundle {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>
    {
        #[derive(Deserialize)]
        struct Raw {
            id: String,
            network: String,
            name: Option<String>,
            cost_price: JsonValue,
            selling_price: String,
            api_id: String,
            data_amount: i32,
            minutes: Option<i32>,
            sms: Option<i32>,
            validity_period: i32,
            commission: String,
            enabled: bool,
            created_at: Option<OffsetDateTime>,
            updated_at: Option<OffsetDateTime>,
        }
        let raw = Raw::deserialize(deserializer)?;
        Ok(DataBundle {
            id: raw.id,
            network: NetworkType::from_str(&raw.network).map_err(serde::de::Error::custom)?,
            name: raw.name,
            cost_price: raw.cost_price,
            selling_price: BigDecimal::parse_bytes(raw.selling_price.as_bytes(), 10)
                .ok_or_else(|| serde::de::Error::custom("invalid selling_price"))?,
            api_id: raw.api_id,
            data_amount: raw.data_amount,
            minutes: raw.minutes,
            sms: raw.sms,
            validity_period: raw.validity_period,
            commission: BigDecimal::parse_bytes(raw.commission.as_bytes(), 10)
                .ok_or_else(|| serde::de::Error::custom("invalid commission"))?,
            enabled: raw.enabled,
            created_at: raw.created_at,
            updated_at: raw.updated_at,
        })
    }
}

impl DataBundle {
    pub fn network(&self) -> NetworkType {
        self.network
    }

    pub fn set_network(&mut self, network: NetworkType) {
        self.network = network;
    }
}
