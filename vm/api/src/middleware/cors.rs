use axum::http::{header, Method};
use tower_http::cors::{CorsLayer, Any};


pub fn user_cors() -> CorsLayer {
    let origins = [
        "https://wondamrtgh.com".parse().unwrap(),
        "https://admin.wondamartgh.com".parse().unwrap(),
    ];

    CorsLayer::new()
        .allow_origin(origins)
        .allow_methods([Method::GET, Method::POST, Method::PATCH])
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
}


pub fn admin_cors() -> CorsLayer {
    let origins = [
        "https://admin.wondamartgh.com".parse().unwrap(),
    ];

    CorsLayer::new()
        .allow_origin(origins)
        .allow_methods(Any)
        .allow_headers(Any)
}

pub fn public_cors() -> CorsLayer {
    CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET])
}