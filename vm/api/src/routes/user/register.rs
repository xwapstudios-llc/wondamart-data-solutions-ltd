use zod_rs::Schema;
use axum::extract::State;
use axum::Json;
use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;
use zod_rs::prelude::ZodSchema;
use crate::app::AppState;
use crate::db_model::{User, UserWallet};
use crate::routes::{RouteResponse, RouteResponseJson};

#[derive(Deserialize, Serialize, Debug, ZodSchema)]
pub struct UserRegisterPostReq {
    #[zod(min_length(2), max_length(255))]
    pub first_name: String,

    #[zod(min_length(2), max_length(255))]
    pub last_name: String,

    #[zod(email)]
    pub email: String,

    #[zod(regex(r"^(0|\+233|233)[25][0-9]{8}$"))]
    pub phone_number: String,
}

pub async fn post(
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<User> {
    println!("[routes::users::register] request...");

    println!("[UserRegisterPost] User request received, {:?}", payload);

    let payload = UserRegisterPostReq::validate_and_parse(&payload)?;

    let user = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (first_name, last_name, email, phone_number)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        "#,
        payload.first_name,
        payload.last_name,
        payload.email,
        payload.phone_number,
    ).fetch_one(app.pool_ref()).await?;

    println!("[UserRegisterPost] User data created, {:?}", user);

    let wallet = sqlx::query_as!(
        UserWallet,
        r#"
        INSERT INTO user_wallets (uid)
        VALUES ($1)
        RETURNING *
        "#,
        user.uid
    ).fetch_one(app.pool_ref()).await?;

    println!("[UserRegisterPost] User wallet created, {:?}", wallet);

    RouteResponse::new_ok(user, None).json_result()
}