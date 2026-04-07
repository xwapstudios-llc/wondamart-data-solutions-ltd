use std::sync::Arc;
use axum::extract::State;
use axum::Router;
use axum::routing::get;
use axum::middleware::from_fn;
use crate::middleware;

pub fn routes(State(pool): State<Arc<sqlx::PgPool>>) -> Router {
    Router::new()
        .route("/admin/*", get(||async { "Admin users endpoint" }))
        .layer(from_fn(middleware::firebase::firebase_auth_middleware))
        .with_state(pool)
}