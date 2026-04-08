use axum::http::{header, Method};
use tower_http::cors::{CorsLayer, Any};


pub fn user_cors() -> CorsLayer {
    // let origins = [
    //     "https://wondamrtgh.com".parse().unwrap(),
    //     "https://admin.wondamartgh.com".parse().unwrap(),
    //     "http://localhost".parse().unwrap(),
    //     "http://0.0.0.0".parse().unwrap(),
    // ];

    CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
}


pub fn admin_cors() -> CorsLayer {
    // let origins = [
    //     "https://admin.wondamartgh.com".parse().unwrap(),
    //     "http://localhost".parse().unwrap(),
    //     "http://0.0.0.0".parse().unwrap(),
    // ];

    CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any)
}

pub fn public_cors() -> CorsLayer {
    CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET])
}