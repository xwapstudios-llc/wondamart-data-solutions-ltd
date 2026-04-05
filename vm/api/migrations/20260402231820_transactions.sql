-- Add migration script here

CREATE TYPE transaction_type AS ENUM ('debit', 'paystack-deposit', 'manual-deposit', 'bundle-purchase', 'afa-purchase', 'checker-purchase', 'admin-debit', 'admin-credit', 'refund');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'success', 'failed');
CREATE TABLE transactions (
                              tx_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
                              agent_id INTEGER REFERENCES users(uid) NOT NULL,
                              type transaction_type NOT NULL,
                              status transaction_status NOT NULL,
                              amount DECIMAL(12,2) NOT NULL,
                              commission DECIMAL(12,2) NOT NULL DEFAULT 0, -- Commission earned by the agent for this transaction
                              balance DECIMAL(12,2) NOT NULL, -- Balance after transaction tied to the user's wallet
                              api_id VARCHAR(50) REFERENCES api_providers(api_id),
                              data JSONB NOT NULL DEFAULT '{}',
                              admin_data JSONB, -- Additional data for admin use, such as reason for manual adjustments
                              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                              completed_at TIMESTAMPTZ,
                              UNIQUE (tx_id)
);
-- Indexes for transactions
CREATE INDEX idx_transactions_id ON transactions(tx_id);
CREATE INDEX idx_transactions_time ON transactions(created_at DESC);
CREATE INDEX idx_transactions_updated ON transactions(updated_at DESC);
CREATE INDEX idx_transactions_agent_id ON transactions(agent_id);
CREATE INDEX idx_transactions_agent_type_status ON transactions(agent_id, type, status);
CREATE INDEX idx_transactions_status_type ON transactions(status, type);
CREATE INDEX idx_transactions_agent_time ON transactions(agent_id, created_at DESC);

CREATE INDEX idx_transactions_data_network ON transactions USING GIN (data);
CREATE INDEX idx_transactions_data_network_btree ON transactions((data->>'network')) WHERE type = 'bundle-purchase';
