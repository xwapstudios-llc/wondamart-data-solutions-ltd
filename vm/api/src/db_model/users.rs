use serde::{Serialize, Deserialize};
use sqlx::types::JsonValue;
use sqlx::PgPool;
use time::OffsetDateTime;
use crate::db_model::DBModel;
use crate::error::AppError;

#[derive(Serialize, Deserialize, Debug)]
struct UserMetadata;

impl From<JsonValue> for UserMetadata {
    fn from(_value: JsonValue) -> Self {
        // Implement the conversion logic here
        UserMetadata
    }
}
impl From<UserMetadata> for JsonValue {
    fn from(_metadata: UserMetadata) -> Self {
        // Implement the conversion logic here
        JsonValue::Null
    }
}

#[derive(Serialize, Deserialize, sqlx::FromRow, Debug)]
pub struct User {
    pub uid: Option<i32>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub profile_photo_url: Option<String>,
    pub is_active: bool,
    pub email_verified: bool,
    pub phone_verified: bool,
    pub last_login: Option<OffsetDateTime>,
    pub last_activity: Option<OffsetDateTime>,
    pub metadata: JsonValue,
    pub created_at: Option<OffsetDateTime>,
    pub updated_at: Option<OffsetDateTime>,
}

impl DBModel for User {
    type IdType = i32;

    async fn from_db(pool: &PgPool, id: Self::IdType) -> Result<Self, AppError> {
        let user = sqlx::query_as!(
            User,
            r#"
            SELECT uid, email, phone_number, first_name, last_name, profile_photo_url, is_active, email_verified, phone_verified, last_login, last_activity, metadata, created_at, updated_at
            FROM users
            WHERE uid = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await?;

        Ok(user)
    }

    async fn update_db(&self, pool: &PgPool) -> Result<(), AppError> {
        sqlx::query!(
            r#"
            UPDATE users
            SET email = $2, phone_number = $3, first_name = $4, last_name = $5, profile_photo_url = $6, is_active = $7, email_verified = $8, phone_verified = $9, last_login = $10, last_activity = $11, metadata = $12, updated_at = NOW()
            WHERE uid = $1
            "#,
            self.uid,
            self.email,
            self.phone_number,
            self.first_name,
            self.last_name,
            self.profile_photo_url,
            self.is_active,
            self.email_verified,
            self.phone_verified,
            self.last_login,
            self.last_activity,
            self.metadata
        )
        .execute(pool)
        .await?;

        Ok(())
    }

    async fn new_db_entry(self, pool: &PgPool) -> Result<Self::IdType, AppError> {
        let record = sqlx::query!(
            r#"
            INSERT INTO users (email, phone_number, first_name, last_name, profile_photo_url, is_active, email_verified, phone_verified, last_login, last_activity, metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING uid
            "#,
            self.email,
            self.phone_number,
            self.first_name,
            self.last_name,
            self.profile_photo_url,
            self.is_active,
            self.email_verified,
            self.phone_verified,
            self.last_login,
            self.last_activity,
            self.metadata
        )
        .fetch_one(pool)
        .await?;

        Ok(record.uid)
    }
}
