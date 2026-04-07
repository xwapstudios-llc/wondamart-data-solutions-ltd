use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode, decode_header};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FirebaseClaims {
    pub iss: String,
    pub aud: String,
    pub sub: String,
    pub iat: i64,
    pub exp: i64,
    pub auth_time: i64,
    pub user_id: String,
    pub email: Option<String>,
    pub email_verified: Option<bool>,
    pub firebase: FirebaseData,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FirebaseData {
    pub identities: HashMap<String, Vec<String>>,
    pub sign_in_provider: String,
}

async fn verify_firebase_token(
    token: &str,
    project_id: &str,
) -> Result<FirebaseClaims, Box<dyn std::error::Error>> {
    // Decode header to get kid (key id)
    let header = decode_header(token)?;
    let kid = header.kid.ok_or("No key ID in token header")?;

    // Fetch Firebase public keys
    let client = Client::new();
    let keys_url =
        "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
    let response = client.get(keys_url).send().await?;
    let keys: HashMap<String, String> = response.json().await?;

    // Find the key matching the kid
    let key_pem = keys.get(&kid).ok_or("Key not found")?;

    // Create decoding key from PEM
    let decoding_key = DecodingKey::from_rsa_pem(key_pem.as_bytes())?;

    // Set up validation
    let mut validation = Validation::new(Algorithm::RS256);
    validation.set_issuer(&[format!("https://securetoken.google.com/{}", project_id)]);
    validation.set_audience(&[project_id]);

    // Decode and validate the token
    let token_data = decode::<FirebaseClaims>(token, &decoding_key, &validation)?;

    Ok(token_data.claims)
}

pub async fn firebase_auth_middleware(
    req: axum::http::Request<axum::body::Body>,
    next: axum::middleware::Next,
) -> Result<axum::response::Response, axum::http::status::StatusCode> {
    let project_id = "YOUR_PROJECT_ID";
    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|v| v.to_str().ok());

    let token = match auth_header {
        Some(h) if h.starts_with("Bearer ") => &h[7..],
        _ => return Err(axum::http::StatusCode::UNAUTHORIZED),
    };

    let decoded = crate::middleware::firebase::verify_firebase_token(token, project_id)
        .await
        .map_err(|_| axum::http::StatusCode::UNAUTHORIZED)?;

    // Inject into request extensions
    let mut req = req;
    req.extensions_mut().insert(decoded);

    Ok(next.run(req).await)
}
