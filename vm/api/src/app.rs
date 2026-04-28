use std::sync::Arc;
use tokio::sync::Mutex;
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use crate::error::AppError;
use crate::services::bundle_service::BundleService;
use crate::services::tx_service::TxService;

pub async fn create_pool() -> Result<PgPool, AppError> {
    if let Ok(db_url) = std::env::var("DATABASE_URL") {
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&db_url)
            .await;

        match pool {
            Ok(pool) => Ok(pool),
            Err(e) => Err(AppError::DbError(e))
        }
    } else {
        Err(AppError::Internal("Unable to get database url var: DATABASE_URL".into()))
    }
}

pub struct App {
    pub pool: Arc<PgPool>,
    pub bundle_service: Arc<Mutex<BundleService>>,
    pub tx_service: Arc<Mutex<TxService>>,
}
pub type AppState = Arc<App>;

impl App {
    pub async fn new() -> Result<Self, AppError> {
        println!("[app::new()] Trying to initialize app...");
        let pool = Arc::new(create_pool().await?);
        println!("[app::new()] Running migrations...");
        sqlx::migrate!().run(&*pool).await?;

        println!("[app::new()] Creating services...");
        let bundle_service = Arc::new(Mutex::new(BundleService::new(pool.clone()).await?));

        println!("[app::new()] Creating Transaction Service...");
        let tx_service = Arc::new(Mutex::new(TxService::new(pool.clone())));
        
        Ok(Self { pool, bundle_service, tx_service })
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
