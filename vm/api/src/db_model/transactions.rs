use serde::{Serialize, Deserialize, Serializer, Deserializer};
use sqlx::types::{BigDecimal, JsonValue};
use sqlx::PgPool;
use sqlx::Row;
use time::OffsetDateTime;
use crate::db_model::DBModel;
use crate::error::AppError;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum TransactionType {
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
    Refund,
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
            _ => Err(format!("Unknown transaction type: {}", s)),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum TransactionStatus {
    Pending,
    Processing,
    Success,
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

#[derive(Debug, sqlx::FromRow)]
pub struct Transaction {
    pub tx_id: Option<i32>,
    pub agent_id: i32,
    #[sqlx(rename = "type")]
    pub type_str: String,
    pub status_str: String,
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
            SELECT tx_id, agent_id, type as "type_str: _", status as "status_str: _", amount, commission, balance, api_id, data, admin_data, created_at, updated_at, completed_at
            FROM transactions
            WHERE tx_id = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await?;

        Ok(tx)
    }

    async fn update_db(&self, pool: &PgPool) -> Result<(), AppError> {
        sqlx::query(
            r#"
            UPDATE transactions
            SET status = $2, balance = $3, data = $4, admin_data = $5, completed_at = $6, updated_at = NOW()
            WHERE tx_id = $1
            "#
        )
        .bind(self.tx_id)
        .bind(&self.status_str)
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
        .bind(&self.type_str)
        .bind(&self.status_str)
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

impl Transaction {
    pub fn transaction_type(&self) -> Result<TransactionType, String> {
        TransactionType::from_str(&self.type_str)
    }

    pub fn set_transaction_type(&mut self, tx_type: TransactionType) {
        self.type_str = tx_type.as_str().to_string();
    }

    pub fn status(&self) -> Result<TransactionStatus, String> {
        TransactionStatus::from_str(&self.status_str)
    }

    pub fn set_status(&mut self, status: TransactionStatus) {
        self.status_str = status.as_str().to_string();
    }
}

impl Serialize for Transaction {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer
    {
        todo!()
    }
}
impl<'de> Deserialize<'de> for Transaction {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>
    {
        todo!()
    }
}