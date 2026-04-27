use axum::extract::{Query, State};
use serde::{Deserialize, Serialize};
use crate::app::AppState;
use crate::routes::{RouteResponse, RouteResponseJson};

#[derive(Deserialize, Serialize, Debug)]
pub struct GuestTrackGetReq {
    pub phone_number: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GuestTrackGetRes{}

pub async fn get(
    State(app): State<AppState>,
    Query(payload): Query<GuestTrackGetReq>,
) -> RouteResponseJson<GuestTrackGetRes> {
    // Implementation
    let res = GuestTrackGetRes {};

    RouteResponse::new_ok(res, None).json_result()
}
