// What sub points do we need under user.
// 1. Fetch user data and wallets.
// 2. Make deposits into account.
// 3. Buy bundles and other products.
// 4. Read transactions and purchase history.
// 5. Read commissions and redeem them.
// 6. Set up a store. Modify the store.
// 7. Modify user data.

use std::sync::Arc;
use axum::extract::State;
use axum::Json;
use serde::{Deserialize, Serialize};
use zod_rs::prelude::ZodSchema;
use crate::error::AppError;
use crate::routes::home::HomeResponse;

// #[derive(Deserialize, Serialize, Debug, ZodSchema)]
// struct GetUser {}

pub async fn get_user(
    State(pool): State<Arc<sqlx::PgPool>>
) -> Result<Json<HomeResponse>, AppError> {
    // First validate ingress token with firebase_auth
    // Next is to extract the user id and firebase_auth credentials
    // Next, find the user from the users database table.
    // Finally return the user data with status Ok(200)

    todo!()
}