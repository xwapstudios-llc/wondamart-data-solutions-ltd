mod pool;
mod routes;
pub mod db_model;
pub mod error;
pub mod middleware;
pub mod services;
pub mod api_providers;

use std::process::exit;
use std::sync::Arc;
use pool::{create_pool};
use services::{TransactionManager, TransactionManagerConfig, start_transaction_worker};

async fn run() -> Result<(), Box<dyn std::error::Error>> {
    let pool = create_pool().await?;
    sqlx::migrate!().run(&pool).await?;

    let pool = Arc::new(pool);

    // Initialize Transaction Manager with default configuration
    let tx_manager = Arc::new(TransactionManager::new(
        pool.clone(),
        TransactionManagerConfig::default(),
    ));

    // Start the background transaction worker
    let _worker_handle = start_transaction_worker(tx_manager, None);
    println!("[run] Transaction worker started...");

    let app = routes::routes(pool);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
    axum::serve(listener, app.into_make_service()).await?;
    Ok(())
}

#[tokio::main]
async fn main() {
    println!("[main] Running server...");

    if let Err(e) = run().await {
        eprintln!("[main] Application error: {}", e);
        exit(1);
    }

    println!("[main] I really don't like the way docker is not using my changes...")
}
