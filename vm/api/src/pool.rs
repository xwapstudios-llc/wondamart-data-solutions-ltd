use sqlx::postgres::PgPoolOptions;

pub async fn create_pool() -> Result<sqlx::PgPool, Box<dyn std::error::Error>> {
    let db_url = std::env::var("DATABASE_URL")?;

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await;
    
    match pool {
        Ok(pool) => {Ok(pool)}
        Err(e) => {Err(Box::new(e))}
    }
}
