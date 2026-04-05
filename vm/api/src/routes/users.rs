use zod_rs::Schema;
use crate::error::AppError;
use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use sqlx::types::JsonValue;
use zod_rs::prelude::ZodSchema;
use crate::db_model::{User};

#[derive(Deserialize, Serialize, Debug, ZodSchema)]
pub struct CreateUser {
    #[zod(min_length(2), max_length(255))]
    pub first_name: String,

    #[zod(min_length(2), max_length(255))]
    pub last_name: String,

    #[zod(email)]
    pub email: String,

    #[zod(regex(r"^(0|\+233|233)[25][0-9]{8}$"))]
    pub phone_number: String,
}

pub async fn create_user(
    State(pool): State<Arc<sqlx::PgPool>>,
    Json(payload): Json<JsonValue>,
) -> Result<Json<User>, AppError> {
    let payload = CreateUser::validate_and_parse(&payload)?;

    let user = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (first_name, last_name, email, phone_number)
        VALUES ($1, $2, $3, $4)
        RETURNING uid, email, phone_number, first_name, last_name, profile_photo_url, is_active, email_verified, phone_verified, last_login, last_activity, metadata, created_at, updated_at
        "#,
        payload.first_name,
        payload.last_name,
        payload.email,
        payload.phone_number,
    ).fetch_one(&*pool).await?;


    // sqlx::query!(
    //     r#"
    //     INSERT INTO user_wallets (uid)
    //     VALUES ($1)
    //     "#,
    //     user.uid
    // ).fetch_one(&*pool).await?;

    Ok(Json(user))
}

pub async fn list_users(
    State(pool): State<Arc<sqlx::PgPool>>,
) -> Result<Json<Vec<User>>, AppError> {
    let users = sqlx::query_as!(
        User,
        r#"
        SELECT uid, email, phone_number, first_name, last_name, profile_photo_url, is_active, email_verified, phone_verified, last_login, last_activity, metadata, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
        "#
    ).fetch_all(&*pool).await?;

    Ok(Json(users))
}
