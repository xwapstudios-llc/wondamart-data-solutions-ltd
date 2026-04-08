mod home;
mod user;
mod webhooks;
mod admin;
mod guest;
mod response;

use std::sync::Arc;
use axum::{Router};
use axum::routing;
use chrono::{DateTime, Utc};
use serde::Serialize;
pub use response::*;


pub fn routes(pool: Arc<sqlx::PgPool>) -> Router {
    println!("[routes] Setting up routes...");

    Router::new()
        .route("/", routing::get(get))
        .with_state(pool.clone())
        .merge(guest::routes(pool.clone()))
        .merge(user::routes(pool.clone()))
        .merge(admin::routes(pool.clone()))
        .merge(webhooks::routes(pool.clone()))
}


#[derive(Serialize)]
pub struct HomeResponse {
    service: String,
    status: String,
    timestamp: String,
}

pub async fn get() -> RouteResponseJson<HomeResponse> {
    let timestamp: DateTime<Utc> = Utc::now();
    let res = HomeResponse {
        service: "Wondamart API".to_string(),
        status: "running".to_string(),
        timestamp: timestamp.to_rfc3339(),
    };

    RouteResponse::new_ok(
        res,
        Some("Thanks for using Wondamart Data Solutions".to_string())
    ).json_result()
}
