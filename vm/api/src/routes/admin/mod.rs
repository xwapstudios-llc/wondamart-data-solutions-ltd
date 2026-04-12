mod api_providers;

use axum::Router;
use axum::routing::get;
use std::sync::Arc;

pub fn routes(pool: Arc<sqlx::PgPool>) -> Router {
    println!("[routes::admin] Setting up...");

    Router::new()
        .route("/admin", get(|| async { "Admin users endpoint" }))
        .route(
            "/admin/api-provider",
            get(api_providers::get)
                .post(api_providers::post)
                .put(api_providers::put)
                .delete(api_providers::delete),
        )
        // .layer(from_fn(middleware::firebase::firebase_auth_middleware))
        .with_state(pool)
}
