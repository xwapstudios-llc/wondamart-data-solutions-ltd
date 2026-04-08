use std::sync::Arc;
use axum::Router;
use axum::routing::get;

pub fn routes(pool: Arc<sqlx::PgPool>) -> Router {
    println!("[routes::admin] Setting up...");

    Router::new()
        .route("/admin", get(||async { "Admin users endpoint" }))
        // .layer(from_fn(middleware::firebase::firebase_auth_middleware))
        .with_state(pool)
}