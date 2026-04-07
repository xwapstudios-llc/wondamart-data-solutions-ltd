mod pool;
mod routes;
pub mod db_model;
pub mod error;
pub mod middleware;

use std::process::exit;
use std::sync::Arc;
use pool::{create_pool};

use axum::{routing::{get, post}, Router};
use tower_http::cors::{CorsLayer, Any};

async fn run() -> Result<(), Box<dyn std::error::Error>> {
    let pool = create_pool().await?;
    sqlx::migrate!().run(&pool).await?;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(routes::home::home))
        .route("/test-db", get(routes::test_db::test_db))
        .route("/users", post(routes::users::create_user).get(routes::users::list_users))
        .layer(cors)
        .with_state(Arc::new(pool));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
    axum::serve(listener, app.into_make_service()).await?;
    Ok(())
}

#[tokio::main]
async fn main() {
    println!("Something ...");
    println!("Running server...");

    if let Err(e) = run().await {
        eprintln!("Application error: {}", e);
        exit(1);
    }
}
