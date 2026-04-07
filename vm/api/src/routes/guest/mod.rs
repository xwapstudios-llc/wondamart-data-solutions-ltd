// What do guest want to do?
// 1. Fetch a store with id.
// // /guest/store
// 2. Buy from the store.
// /guest/buy
// 3. Track orders by phone number.
// /guest/track

use std::sync::Arc;
use axum::extract::State;
use axum::middleware::from_fn;
use axum::Router;
use axum::routing::{get, post};
use crate::middleware;

mod store;
mod buy;
mod track;

pub fn routes(State(pool): State<Arc<sqlx::PgPool>>) -> Router {
    Router::new()
        .route("/agent/store", get(store::get))
        .route("/agent/buy", post(buy::post))
        .route("/agent/track", get(track::get))
        .layer(from_fn(middleware::firebase::firebase_auth_middleware))
        .layer(middleware::cors::public_cors())
        .with_state(pool)
}