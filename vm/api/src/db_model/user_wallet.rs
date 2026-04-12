use serde::{Serialize, Deserialize, Serializer, Deserializer};
use sqlx::types::BigDecimal;
use sqlx::PgPool;
use sqlx::Row;
use time::OffsetDateTime;
use crate::db_model::DBModel;
use crate::error::AppError;

#[derive(Debug, sqlx::FromRow)]
pub struct UserWallet {
    pub uid: Option<i32>,
    pub amount: Option<BigDecimal>,
    pub commission: Option<BigDecimal>,
    pub created_at: Option<OffsetDateTime>,
    pub updated_at: Option<OffsetDateTime>,
}

impl DBModel for UserWallet {
    type IdType = i32;

    async fn from_db(pool: &PgPool, id: Self::IdType) -> Result<Self, AppError> {
        let wallet = sqlx::query_as!(
            UserWallet,
            r#"
            SELECT uid, amount, commission, created_at, updated_at
            FROM user_wallets
            WHERE uid = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await?;

        Ok(wallet)
    }

    async fn update_db(self, pool: &PgPool) -> Result<(), AppError> {
        sqlx::query!(
            r#"
            UPDATE user_wallets
            SET amount = $2, commission = $3, updated_at = NOW()
            WHERE uid = $1
            "#,
            self.uid,
            self.amount,
            self.commission
        )
        .execute(pool)
        .await?;

        Ok(())
    }

    async fn new_db_entry(self, pool: &PgPool) -> Result<Self::IdType, AppError> {
        let record = sqlx::query!(
            r#"
            INSERT INTO user_wallets (uid, amount, commission)
            VALUES ($1, $2, $3)
            RETURNING uid
            "#,
            self.uid,
            self.amount,
            self.commission
        )
        .fetch_one(pool)
        .await?;

        Ok(record.uid)
    }
}
