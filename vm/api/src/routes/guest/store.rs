use axum::extract::{Query, State};
use serde::{Deserialize, Serialize};
use crate::app::AppState;
use crate::db_model::{AgentStore, DBModel};
use crate::routes::{RouteResponse, RouteResponseJson};

#[derive(Deserialize, Serialize, Debug)]
pub struct GuestStoreGetReq {
    pub store_id: String,
}

pub async fn get(
    State(app): State<AppState>,
    Query(payload): Query<GuestStoreGetReq>,
) -> RouteResponseJson<AgentStore> {
    println!("[routes::guest::store::get]");

    println!("[/guest/store] Received payload: {:?}", &payload);

    // Implementation
    let store = AgentStore::from_db(&app.pool(), payload.store_id).await?;
    println!("[/guest/store] Found Agent Store: {:?}", &store);

    RouteResponse::new_ok(store, None).json_result()
}
