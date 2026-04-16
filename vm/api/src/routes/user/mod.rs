// What sub points do we need under user.
// 1. Fetch user data and wallets.
// 2. Make deposits into account.
// 3. Buy bundles and other products.
// 4. Read transactions and purchase history.
// 5. Read commissions and redeem them.
// 6. Set up a store. Modify the store.
// 7. Modify user data.

use zod_rs::Schema;
mod register;
mod data_bundle;

use crate::db_model::{DBModel, User};
use crate::middleware;
use axum::extract::State;
use axum::routing;
use axum::{Json, Router};
use sqlx::types::JsonValue;
use serde::{Deserialize, Serialize};
use zod_rs::prelude::ZodSchema;
use crate::app::AppState;
use crate::routes::{RouteResponse, RouteResponseJson};

pub fn routes(app: AppState) -> Router {
    println!("[routes::users] Setting up...");

    Router::new()
        .route("/user", routing::get(get).put(put).delete(delete))
        //.layer(from_fn(middleware::firebase::firebase_auth_middleware))
        .route("/user/register", routing::post(register::post))
        .route("/user/data-bundle", routing::post(data_bundle::post))
        .layer(middleware::cors::user_cors())
        .with_state(app)
}

#[derive(Debug, Serialize, Deserialize, ZodSchema)]
struct UserGetReq {
    #[zod(number)]
    uid: i32,
}

async fn get(
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<User> {
    // Request
    let payload = UserGetReq::validate_and_parse(&payload)?;

    // Implementation
    let user = User::from_db(app.pool_ref(), payload.uid).await?;

    // Result
    RouteResponse::new_ok(user, None).json_result()
}


#[derive(Debug, Serialize, Deserialize, ZodSchema)]
struct UserPostReq {
    #[zod(number)]
    uid: i32,
}
async fn put(
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<User> {
    let payload = UserPostReq::validate_and_parse(&payload)?;

    // Fetch user
    let user = User::from_db(app.pool_ref(), payload.uid).await?;

    // todo: Update user with payload

    // Update user
    user.update_db(app.pool_ref()).await?;

    let updated_user = User::from_db(app.pool_ref(), payload.uid).await?;

    RouteResponse::new_ok(updated_user, None).json_result()
}

#[derive(Debug, Serialize, Deserialize, ZodSchema)]
struct UserDeleteReq {
    #[zod(number)]
    uid: i32,
}
async fn delete(
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<()> {
    let payload = UserDeleteReq::validate_and_parse(&payload)?;

    let user = User::from_db(app.pool_ref(), payload.uid).await?;

    // Implementation
    // 1. move data to deleted table

    RouteResponse::new_ok((), Some("User data deleted successfully".to_string())).json_result()
}