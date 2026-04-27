use std::sync::Arc;
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use crate::error::AppError;
use crate::services::bundle_service::BundleService;

pub async fn create_pool() -> Result<PgPool, AppError> {

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://appuser:password@localhost:5432/appdb")
        .await;

    match pool {
        Ok(pool) => Ok(pool),
        Err(e) => Err(AppError::DbError(e))
    }
}

pub struct App {
    pool: Arc<PgPool>,
    pub bundle_service: Arc<BundleService>,
}
pub type AppState = Arc<App>;

impl App {
    pub async fn new() -> Result<Self, AppError> {
        let pool = Arc::new(create_pool().await?);
        sqlx::migrate!().run(&*pool).await?;

        let bundle_service = BundleService::new(pool.clone()).await?;

        Ok(Self { pool, bundle_service })
    }

    pub async fn new_arc() -> Result<Arc<Self>, AppError> {
        Ok(Arc::new(Self::new().await?))
    }

    pub fn pool(&self) -> Arc<PgPool> {
        self.pool.clone()
    }

    pub fn pool_ref(&self) -> &PgPool {
        &self.pool
    }
}
