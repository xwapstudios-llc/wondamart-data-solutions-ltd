use zod_rs::Schema;
use axum::extract::State;
use axum::Json;
use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;
use zod_rs::prelude::ZodSchema;
use crate::app::AppState;
use crate::db_model::{AgentStore, DBModel};
use crate::routes::{RouteResponse, RouteResponseJson};

#[derive(Deserialize, Serialize, Debug, ZodSchema)]
struct GuestStoreGetReq {
    #[zod(min_length(2), max_length(255))]
    pub store_id: String,
}

pub async fn get(
    State(app): State<AppState>,
    Json(payload): Json<JsonValue>,
) -> RouteResponseJson<AgentStore> {
    println!("[routes::guest::store::get]");

    println!("[/guest/store] Received payload: {:?}", &payload);
    let payload = GuestStoreGetReq::validate_and_parse(&payload)?;

    // Implementation
    let store = AgentStore::from_db(&app.pool(), payload.store_id).await?;
    println!("[/guest/store] Found Agent Store: {:?}", &store);

    RouteResponse::new_ok(store, None).json_result()
}