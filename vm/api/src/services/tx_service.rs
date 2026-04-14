use std::sync::Arc;
use sqlx::PgPool;

pub struct TxService {
    pool: Arc<PgPool>,
}

impl TxService {
    pub fn new(pool: Arc<PgPool>) -> Self {
        Self { pool }
    }
}
