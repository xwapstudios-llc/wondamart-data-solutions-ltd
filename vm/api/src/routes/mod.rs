mod admin;
mod guest;
mod response;
mod user;
mod webhooks;

use crate::app::AppState;
use axum::Router;
use axum::routing;
use chrono::{DateTime, Utc};
pub use response::*;
use serde::Serialize;

pub fn routes(app: AppState) -> Router {
    println!("[routes] Setting up routes...");

    Router::new()
        .route("/", routing::get(get))
        .with_state(app.clone())
        .merge(guest::routes(app.clone()))
        .merge(user::routes(app.clone()))
        .merge(admin::routes(app.clone()))
        .merge(webhooks::routes(app.clone()))
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
        Some("Thanks for using Wondamart Data Solutions".to_string()),
    )
    .json_result()
}
