pub mod transaction_manager;
pub mod transaction_worker;
pub mod workers;

pub use transaction_manager::{TransactionManager, TransactionManagerConfig};
pub use transaction_worker::start_transaction_worker;
pub use workers::{TransactionWorkerTrait, WorkerContext, BundleTransactionWorker, AfaTransactionWorker, DepositTransactionWorker};

/*
Let's change the transaction manager and worker model.
The transaction manager is responsible for tacking transactions.
However, the transaction worker is not one.
We should be able to create workers for each `pending` transaction.

Our transactions depend on third party. So we update the transaction status to `processing`
immediately a worker starts working on it. Note that we do not fail transactions if it is in processing
because we have sent it to a third party. And workers are not full threads but a sub async kokio process.

Next, we will define workers according to transaction types because not all transactions are the same.
Data bundle transactions are treated differently from Afa bundles. Same case applies to the others.
So we need to create a worker trait and manage all of them under the manager.
Manager deals with the delay. And deal with all modification APIs from other parts of the application.

Transactions that usually involve third party uses webhooks to mark completed. No need to worry about webhooks.
So the worker can stop when the transaction is sent. And those that do not involve third party or
we can ensure it is completed, the worker mark it as completed and end.

Transaction manager config should allow:
1, max workers so that we don't max out the resources.
2. delay before transactions.
3. Retry if worker does not exit smoothly (eg. network error).
4. Max reties.
*/