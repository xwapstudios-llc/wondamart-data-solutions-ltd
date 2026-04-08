mod pool;
mod routes;
pub mod db_model;
pub mod error;
pub mod middleware;

use std::process::exit;
use std::sync::Arc;
use pool::{create_pool};

async fn run() -> Result<(), Box<dyn std::error::Error>> {
    let pool = create_pool().await?;
    sqlx::migrate!().run(&pool).await?;

    let app = routes::routes(Arc::new(pool));

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
