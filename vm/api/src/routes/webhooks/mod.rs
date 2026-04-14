// What do webhooks need to offer
// 1. Allow endpoints to notify us.
// i) Paystack
// ii) Bundle services
// 2. Create a generic webhook system that tracks
// `/webhooks/:id` and then map the id based on db.

use axum::Router;
use crate::app::AppState;
use crate::middleware::cors::public_cors;

pub fn routes(pool: AppState) -> Router {
    println!("[routes::webhooks] Setting up...");

    Router::new()
        .layer(public_cors())
        .with_state(pool)
}