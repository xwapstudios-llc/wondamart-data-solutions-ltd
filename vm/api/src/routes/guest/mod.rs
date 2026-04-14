// What do guest want to do?
// 1. Fetch a store with id.
// // /guest/store
// 2. Buy from the store.
// /guest/buy
// 3. Track orders by phone number.
// /guest/track

use axum::Router;
use axum::routing::{get, post};
use crate::app::AppState;
use crate::middleware;

mod store;
mod buy;
mod track;

pub fn routes(app: AppState) -> Router {
    println!("[routes::guest] Setting up...");

    Router::new()
        .route("/guest/store", get(store::get))
        .route("/guest/buy", post(buy::post))
        .route("/guest/track", get(track::get))
        //.layer(from_fn(middleware::firebase::firebase_auth_middleware))
        .layer(middleware::cors::user_cors())
        .with_state(app)
}
