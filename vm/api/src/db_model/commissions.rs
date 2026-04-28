use serde::{Serialize, Deserialize, Serializer, Deserializer};
use serde::ser::SerializeStruct;
use sqlx::types::{BigDecimal, JsonValue};
use sqlx::PgPool;
use sqlx::Row;
use time::OffsetDateTime;
use crate::db_model::DBModel;
use crate::error::AppError;

#[derive(Debug, sqlx::FromRow)]
pub struct Commission {
    pub commission_id: i32,
    pub uid: i32,
    pub year: i32,
    pub month_index: i32,
    pub end_of_month: Option<OffsetDateTime>,
    pub payed: bool,
    pub paid_at: Option<OffsetDateTime>,
    pub amount: Option<BigDecimal>,
    pub commissions_detail: JsonValue,
    pub transactions: JsonValue,
    pub created_at: Option<OffsetDateTime>,
    pub updated_at: Option<OffsetDateTime>,
}

impl DBModel for Commission {
    type IdType = i32;

    async fn from_db(pool: &PgPool, id: Self::IdType) -> Result<Self, AppError> {
        let commission = sqlx::query_as!(
            Commission,
            r#"
            SELECT commission_id, uid, year, month_index, end_of_month, payed, paid_at, amount, commissions_detail, transactions, created_at, updated_at
            FROM commissions
            WHERE commission_id = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await?;

        Ok(commission)
    }

    async fn update_db(self, pool: &PgPool) -> Result<(), AppError> {
        sqlx::query!(
            r#"
            UPDATE commissions
            SET payed = $2, paid_at = $3, amount = $4, commissions_detail = $5, transactions = $6, updated_at = NOW()
            WHERE commission_id = $1
            "#,
            self.commission_id,
            self.payed,
            self.paid_at,
            self.amount,
            self.commissions_detail,
            self.transactions,
        )
        .execute(pool)
        .await?;

        Ok(())
    }

    async fn new_db_entry(self, pool: &PgPool) -> Result<Self::IdType, AppError> {
        let record = sqlx::query!(
            r#"
            INSERT INTO commissions (uid, year, month_index, end_of_month, payed, paid_at, amount, commissions_detail, transactions)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING commission_id
            "#,
            self.uid,
            self.year,
            self.month_index,
            self.end_of_month,
            self.payed,
            self.paid_at,
            self.amount,
            self.commissions_detail,
            self.transactions
        )
        .fetch_one(pool)
        .await?;

        Ok(record.commission_id)
    }
}

impl Serialize for Commission {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer
    {

        let mut state = serializer.serialize_struct("Commission", 14)?;
        state.serialize_field("commission_id", &self.commission_id)?;
        state.serialize_field("uid", &self.uid)?;
        state.serialize_field("year", &self.year)?;
        state.serialize_field("month_index", &self.month_index)?;
        state.serialize_field("end_of_month", &self.end_of_month)?;
        state.serialize_field("payed", &self.payed)?;
        state.serialize_field("paid_at", &self.paid_at)?;
        state.serialize_field("amount", &self.amount.clone().unwrap_or(BigDecimal::from(0)).to_plain_string())?;
        state.serialize_field("commissions_detail", &self.commissions_detail)?;
        state.serialize_field("transactions", &self.transactions)?;
        state.serialize_field("created_at", &self.created_at)?;
        state.serialize_field("updated_at", &self.updated_at)?;
        state.end()
    }
}
impl<'de> Deserialize<'de> for Commission {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>
    {
        #[derive(Deserialize)]
        struct Raw {
            commission_id: i32,
            uid: i32,
            year: i32,
            month_index: i32,
            end_of_month: Option<OffsetDateTime>,
            payed: bool,
            paid_at: Option<OffsetDateTime>,
            amount: Option<String>,
            commissions_detail: JsonValue,
            transactions: JsonValue,
            created_at: Option<OffsetDateTime>,
            updated_at: Option<OffsetDateTime>,
        }
        let raw = Raw::deserialize(deserializer)?;
        Ok(Commission {
            commission_id: raw.commission_id,
            uid: raw.uid,
            year: raw.year,
            month_index: raw.month_index,
            end_of_month: raw.end_of_month,
            payed: raw.payed,
            paid_at: raw.paid_at,
            amount: raw.amount.as_deref()
                .map(|s| BigDecimal::parse_bytes(s.as_bytes(), 10)
                    .ok_or_else(|| serde::de::Error::custom("invalid amount")))
                .transpose()?,
            commissions_detail: raw.commissions_detail,
            transactions: raw.transactions,
            created_at: raw.created_at,
            updated_at: raw.updated_at,
        })
    }
}