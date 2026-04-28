extern crate alloc;
extern crate core;

mod routes;
pub mod db_model;
pub mod error;
pub mod middleware;
pub mod api_providers;
pub mod app;
pub mod services;

use std::process::exit;
use crate::app::App;
use crate::error::AppError;

async fn run() -> Result<(), AppError> {
    println!("[run] Transaction worker started...");

    let app = routes::routes(App::new_arc().await?);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
    axum::serve(listener, app.into_make_service()).await?;
    Ok(())
}

#[tokio::main]
async fn main() {
    println!("[main] Running server...");

    if let Err(e) = run().await {
        eprintln!("[main] Application error: {:?}", e);
        exit(1);
    }

    ////
    ///// println!("[main] I really don't like the way docker is not using my changes...")
}
