use serde::{Serialize, Deserialize, Serializer, Deserializer};
use sqlx::types::{BigDecimal, JsonValue};
use sqlx::{Database, Decode, PgPool, Postgres, Type};
use sqlx::error::BoxDynError;
use sqlx::postgres::PgTypeInfo;
use sqlx::Row;
use time::OffsetDateTime;
use crate::db_model::DBModel;
use crate::error::AppError;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum TransactionType {
    #[serde(rename = "Debit")]
    Debit,
    #[serde(rename = "paystack-deposit")]
    PaystackDeposit,
    #[serde(rename = "manual-deposit")]
    ManualDeposit,
    #[serde(rename = "bundle-purchase")]
    BundlePurchase,
    #[serde(rename = "afa-purchase")]
    AfaPurchase,
    #[serde(rename = "checker-purchase")]
    CheckerPurchase,
    #[serde(rename = "admin-debit")]
    AdminDebit,
    #[serde(rename = "admin-credit")]
    AdminCredit,
    #[serde(rename = "refund")]
    Refund,
    #[serde(rename = "withdrawal")]
    Withdrawal
}
impl TransactionType {
    pub fn as_str(&self) -> &'static str {
        match self {
            TransactionType::Debit => "debit",
            TransactionType::PaystackDeposit => "paystack-deposit",
            TransactionType::ManualDeposit => "manual-deposit",
            TransactionType::BundlePurchase => "bundle-purchase",
            TransactionType::AfaPurchase => "afa-purchase",
            TransactionType::CheckerPurchase => "checker-purchase",
            TransactionType::AdminDebit => "admin-debit",
            TransactionType::AdminCredit => "admin-credit",
            TransactionType::Refund => "refund",
            TransactionType::Withdrawal => "withdrawal",
        }
    }

    pub fn from_str(s: &str) -> Result<Self, String> {
        match s {
            "debit" => Ok(TransactionType::Debit),
            "paystack-deposit" => Ok(TransactionType::PaystackDeposit),
            "manual-deposit" => Ok(TransactionType::ManualDeposit),
            "bundle-purchase" => Ok(TransactionType::BundlePurchase),
            "afa-purchase" => Ok(TransactionType::AfaPurchase),
            "checker-purchase" => Ok(TransactionType::CheckerPurchase),
            "admin-debit" => Ok(TransactionType::AdminDebit),
            "admin-credit" => Ok(TransactionType::AdminCredit),
            "refund" => Ok(TransactionType::Refund),
            "withdrawal" => Ok(TransactionType::Withdrawal),
            _ => Err(format!("Unknown transaction type: {}", s)),
        }
    }
}
impl Type<Postgres> for TransactionType {
    #[inline]
    fn type_info() -> <Postgres as sqlx::Database>::TypeInfo {
        PgTypeInfo::with_name("transaction_type")
    }
}
impl Decode<'_, Postgres> for TransactionType {
    #[inline]
    fn decode(value: <Postgres as Database>::ValueRef<'_>) -> Result<Self, BoxDynError> {
        let s = <&str as Decode<Postgres>>::decode(value)?;
        Ok(Self::from_str(s)?)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum TransactionStatus {
    #[serde(rename = "pending")]
    Pending,
    #[serde(rename = "processing")]
    Processing,
    #[serde(rename = "success")]
    Success,
    #[serde(rename = "failed")]
    Failed,
}
impl TransactionStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            TransactionStatus::Pending => "pending",
            TransactionStatus::Processing => "processing",
            TransactionStatus::Success => "success",
            TransactionStatus::Failed => "failed",
        }
    }

    pub fn from_str(s: &str) -> Result<Self, String> {
        match s {
            "pending" => Ok(TransactionStatus::Pending),
            "processing" => Ok(TransactionStatus::Processing),
            "success" => Ok(TransactionStatus::Success),
            "failed" => Ok(TransactionStatus::Failed),
            _ => Err(format!("Unknown transaction status: {}", s)),
        }
    }
}
impl Type<Postgres> for TransactionStatus {
    #[inline]
    fn type_info() -> <Postgres as sqlx::Database>::TypeInfo {
        PgTypeInfo::with_name("transaction_status")
    }
}
impl Decode<'_, Postgres> for TransactionStatus {
    #[inline]
    fn decode(value: <Postgres as Database>::ValueRef<'_>) -> Result<Self, BoxDynError> {
        let s = <&str as Decode<Postgres>>::decode(value)?;
        Ok(Self::from_str(s)?)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum TransactionSource {
    #[serde(rename="admin")]
    Admin,
    #[serde(rename="agent")]
    Agent,
    #[serde(rename="store")]
    Store,
    #[serde(rename="api")]
    API,
    #[serde(rename="unknown")]
    Unknown,
}
impl TransactionSource {
    pub fn as_str(&self) -> &'static str {
        match self {
            TransactionSource::Admin => "admin",
            TransactionSource::Agent => "agent",
            TransactionSource::Store => "store",
            TransactionSource::API => "api",
            TransactionSource::Unknown => "unknown",
        }
    }
    pub fn from_str(s: &str) -> Self {
        match s {
            "admin" => TransactionSource::Admin,
            "agent" => TransactionSource::Agent,
            "store" => TransactionSource::Store,
            "api" => TransactionSource::API,
            _ => Self::Unknown
        }
    }
}
impl Type<Postgres> for TransactionSource {
    fn type_info() -> <Postgres as Database>::TypeInfo {
        PgTypeInfo::with_name("transaction_source")
    }
}
impl Decode<'_, Postgres> for TransactionSource {
    fn decode(value: <Postgres as Database>::ValueRef<'_>) -> Result<Self, BoxDynError> {
        let s = <&str as Decode<Postgres>>::decode(value)?;
        match s {
            "admin" => Ok(TransactionSource::Admin),
            "agent" => Ok(TransactionSource::Agent),
            "store" => Ok(TransactionSource::Store),
            "api" => Ok(TransactionSource::API),
            "unknown" => Ok(TransactionSource::Unknown),
            _ => Err(format!("Unknown transaction source: {}", s).into()),
        }
    }
}

#[derive(Debug, Clone, sqlx::FromRow)]
pub struct Transaction {
    pub tx_id: Option<i32>,
    pub agent_id: i32,
    #[sqlx(rename = "type")]
    pub tx_type: TransactionType,
    pub status: TransactionStatus,
    pub amount: Option<BigDecimal>,
    pub commission: Option<BigDecimal>,
    pub balance: Option<BigDecimal>,
    pub api_id: Option<String>,
    pub data: JsonValue,
    pub admin_data: Option<JsonValue>,
    pub created_at: Option<OffsetDateTime>,
    pub updated_at: Option<OffsetDateTime>,
    pub completed_at: Option<OffsetDateTime>,
}

impl DBModel for Transaction {
    type IdType = i32;

    async fn from_db(pool: &PgPool, id: Self::IdType) -> Result<Self, AppError> {
        let tx = sqlx::query_as!(
            Transaction,
            r#"
            SELECT tx_id, agent_id, type as "tx_type: _", status as "status: _", amount, commission, balance, api_id, data, admin_data, created_at, updated_at, completed_at
            FROM transactions
            WHERE tx_id = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await?;

        Ok(tx)
    }

    async fn update_db(self, pool: &PgPool) -> Result<(), AppError> {
        sqlx::query(
            r#"
            UPDATE transactions
            SET status = $2, balance = $3, data = $4, admin_data = $5, completed_at = $6, updated_at = NOW()
            WHERE tx_id = $1
            "#
        )
        .bind(self.tx_id)
        .bind(&self.status.as_str())
        .bind(&self.balance)
        .bind(&self.data)
        .bind(&self.admin_data)
        .bind(self.completed_at)
        .execute(pool)
        .await?;

        Ok(())
    }

    async fn new_db_entry(self, pool: &PgPool) -> Result<Self::IdType, AppError> {
        let row = sqlx::query(
            r#"
            INSERT INTO transactions (agent_id, type, status, amount, commission, balance, api_id, data, admin_data)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING tx_id
            "#
        )
        .bind(self.agent_id)
        .bind(&self.tx_type.as_str())
        .bind(&self.status.as_str())
        .bind(&self.amount)
        .bind(&self.commission)
        .bind(&self.balance)
        .bind(&self.api_id)
        .bind(&self.data)
        .bind(&self.admin_data)
        .fetch_one(pool)
        .await?;

        Ok(row.get::<i32, _>("tx_id"))
    }
}


impl Serialize for Transaction {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut state = serializer.serialize_struct("Transaction", 14)?;
        state.serialize_field("tx_id", &self.tx_id)?;
        state.serialize_field("agent_id", &self.agent_id)?;
        state.serialize_field("tx_type", &self.tx_type)?;
        state.serialize_field("status", &self.status)?;
        state.serialize_field("amount", &self.amount.as_ref().map(|bd| bd.to_string()))?;
        state.serialize_field("commission", &self.commission.as_ref().map(|bd| bd.to_string()))?;
        state.serialize_field("balance", &self.balance.as_ref().map(|bd| bd.to_string()))?;
        state.serialize_field("api_id", &self.api_id)?;
        state.serialize_field("data", &self.data)?;
        state.serialize_field("admin_data", &self.admin_data)?;
        state.serialize_field("created_at", &self.created_at)?;
        state.serialize_field("updated_at", &self.updated_at)?;
        state.serialize_field("completed_at", &self.completed_at)?;
        state.end()
    }
}
impl<'de> Deserialize<'de> for Transaction {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        use serde::de::{self, MapAccess, Visitor};
        use std::fmt;

        #[derive(Deserialize)]
        #[serde(field_identifier, rename_all = "snake_case")]
        enum Field {
            TxId,
            AgentId,
            TxType,
            Status,
            Amount,
            Commission,
            Balance,
            ApiId,
            Data,
            AdminData,
            CreatedAt,
            UpdatedAt,
            CompletedAt,
        }

        struct TransactionVisitor;

        impl<'de> Visitor<'de> for TransactionVisitor {
            type Value = Transaction;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("struct Transaction")
            }

            fn visit_map<V>(self, mut map: V) -> Result<Transaction, V::Error>
            where
                V: MapAccess<'de>,
            {
                let mut tx_id = None;
                let mut agent_id = None;
                let mut tx_type = None;
                let mut status = None;
                let mut amount = None;
                let mut commission = None;
                let mut balance = None;
                let mut api_id = None;
                let mut data = None;
                let mut admin_data = None;
                let mut created_at = None;
                let mut updated_at = None;
                let mut completed_at = None;

                while let Some(key) = map.next_key()? {
                    match key {
                        Field::TxId => {
                            if tx_id.is_some() {
                                return Err(de::Error::duplicate_field("tx_id"));
                            }
                            tx_id = Some(map.next_value()?);
                        }
                        Field::AgentId => {
                            if agent_id.is_some() {
                                return Err(de::Error::duplicate_field("agent_id"));
                            }
                            agent_id = Some(map.next_value()?);
                        }
                        Field::TxType => {
                            if tx_type.is_some() {
                                return Err(de::Error::duplicate_field("tx_type"));
                            }
                            tx_type = Some(map.next_value()?);
                        }
                        Field::Status => {
                            if status.is_some() {
                                return Err(de::Error::duplicate_field("status"));
                            }
                            status = Some(map.next_value()?);
                        }
                        Field::Amount => {
                            if amount.is_some() {
                                return Err(de::Error::duplicate_field("amount"));
                            }
                            let val: Option<String> = map.next_value()?;
                            amount = val.and_then(|s| s.parse::<BigDecimal>().ok());
                        }
                        Field::Commission => {
                            if commission.is_some() {
                                return Err(de::Error::duplicate_field("commission"));
                            }
                            let val: Option<String> = map.next_value()?;
                            commission = val.and_then(|s| s.parse::<BigDecimal>().ok());
                        }
                        Field::Balance => {
                            if balance.is_some() {
                                return Err(de::Error::duplicate_field("balance"));
                            }
                            let val: Option<String> = map.next_value()?;
                            balance = val.and_then(|s| s.parse::<BigDecimal>().ok());
                        }
                        Field::ApiId => {
                            if api_id.is_some() {
                                return Err(de::Error::duplicate_field("api_id"));
                            }
                            api_id = Some(map.next_value()?);
                        }
                        Field::Data => {
                            if data.is_some() {
                                return Err(de::Error::duplicate_field("data"));
                            }
                            data = Some(map.next_value()?);
                        }
                        Field::AdminData => {
                            if admin_data.is_some() {
                                return Err(de::Error::duplicate_field("admin_data"));
                            }
                            admin_data = Some(map.next_value()?);
                        }
                        Field::CreatedAt => {
                            if created_at.is_some() {
                                return Err(de::Error::duplicate_field("created_at"));
                            }
                            created_at = Some(map.next_value()?);
                        }
                        Field::UpdatedAt => {
                            if updated_at.is_some() {
                                return Err(de::Error::duplicate_field("updated_at"));
                            }
                            updated_at = Some(map.next_value()?);
                        }
                        Field::CompletedAt => {
                            if completed_at.is_some() {
                                return Err(de::Error::duplicate_field("completed_at"));
                            }
                            completed_at = Some(map.next_value()?);
                        }
                    }
                }

                let agent_id = agent_id.ok_or_else(|| de::Error::missing_field("agent_id"))?;
                let tx_type = tx_type.ok_or_else(|| de::Error::missing_field("tx_type"))?;
                let status = status.ok_or_else(|| de::Error::missing_field("status"))?;
                let data = data.ok_or_else(|| de::Error::missing_field("data"))?;

                Ok(Transaction {
                    tx_id,
                    agent_id,
                    tx_type,
                    status,
                    amount,
                    commission,
                    balance,
                    api_id,
                    data,
                    admin_data,
                    created_at,
                    updated_at,
                    completed_at,
                })
            }
        }

        deserializer.deserialize_struct(
            "Transaction",
            &[
                "tx_id",
                "agent_id",
                "tx_type",
                "status",
                "amount",
                "commission",
                "balance",
                "api_id",
                "data",
                "admin_data",
                "created_at",
                "updated_at",
                "completed_at",
            ],
            TransactionVisitor,
        )
    }
}
