use axum::{extract::State, response::Json};
use sqlx::Row;
use std::sync::Arc;
use crate::error::AppError;


pub
async fn test_db(
    State(pool): State<Arc<sqlx::PgPool>>,
) -> Result<Json<Vec<String>>, AppError> {
    let rows = sqlx::query("SELECT name FROM test")
        .fetch_all(&*pool)
        .await?;

    let names = rows
        .into_iter()
        .map(|row| row.get::<String, _>("name"))
        .collect();

    Ok(Json(names))
}