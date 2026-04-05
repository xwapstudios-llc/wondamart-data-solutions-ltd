-- Add migration script here

CREATE TABLE commissions (
                             commission_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
                             uid INTEGER NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
                             year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
                             month_index INT NOT NULL CHECK (month_index >= 0 AND month_index <= 11) DEFAULT EXTRACT(MONTH FROM CURRENT_DATE) - 1,
                             end_of_month TIMESTAMPTZ NOT NULL DEFAULT (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month - 1 second'),
                             payed BOOLEAN NOT NULL DEFAULT FALSE,
                             paid_at TIMESTAMPTZ,
                             amount DECIMAL(12,2) NOT NULL DEFAULT 0,
                             commissions_detail JSONB NOT NULL DEFAULT '{}',
                             transactions JSONB NOT NULL DEFAULT '[]', -- List of transaction IDs that contributed to this commission, stored as [{"tx_id": 1, "amount": 10.00}, {"tx_id": 2, "amount": 5.00}]
                             created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                             updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                             UNIQUE(uid, commission_id)
);
-- Indexes for commissions
CREATE INDEX idx_commissions_uid ON commissions(uid);
CREATE INDEX idx_commissions_year_month ON commissions(uid, year, month_index);
CREATE INDEX idx_commissions_payed ON commissions(uid, payed);
CREATE INDEX idx_commissions_amount ON commissions(uid, amount);
CREATE INDEX idx_commissions_time ON commissions(created_at DESC);
CREATE INDEX idx_commissions_time_amount ON commissions(created_at DESC, amount DESC);
CREATE INDEX idx_commissions_updated ON commissions(updated_at DESC);
