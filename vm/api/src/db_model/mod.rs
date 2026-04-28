mod users;
mod transactions;
mod commissions;
mod data_bundles;
mod agent_stores;
mod api_providers;
mod user_wallet;
mod afa_bundle;

use crate::error::AppError;
pub use self::users::*;
pub use self::transactions::*;
pub use self::commissions::*;
pub use self::data_bundles::*;
pub use self::agent_stores::*;
pub use self::api_providers::*;
pub use self::user_wallet::*;
pub use self::afa_bundle::*;


pub trait DBModel: Sized {
    type IdType;
    /// Create a new instance from the database.
    /// This queries a specific database table with the id
    async fn from_db(pool: &sqlx::PgPool, id: Self::IdType) -> Result<Self, AppError>;

    /// Overwrite the database entry at id with the state of the struct.
    /// Call this only if you have an entry already
    async fn update_db(self, pool: &sqlx::PgPool) -> Result<(), AppError>;

    /// Create a new entry and return the new entry id. Note that this will destroy self.
    async fn new_db_entry(self, pool: &sqlx::PgPool) -> Result<Self::IdType, AppError>;
}
