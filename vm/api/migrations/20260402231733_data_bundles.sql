-- Add migration script here

CREATE TYPE network_type AS ENUM ('mtn', 'telecel', 'airteltigo');
-- CREATE TYPE
CREATE TABLE data_bundles (
                              id VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
                              network network_type NOT NULL,
                              name VARCHAR(255),

                              cost_price JSONB NOT NULL DEFAULT '[]', -- A list of cost prices from different API providers for this bundle, stored as [{"api_id": "api1", "price": 10.00}, {"api_id": "api2", "price": 9.50}]
                              selling_price DECIMAL(12,2) NOT NULL DEFAULT 0, -- Default selling price for agents if not specified by API provider
                              api_id VARCHAR(50) REFERENCES api_providers(api_id), -- API provider offering this bundle

                              data_amount INT NOT NULL,
                              minutes INT,
                              sms INT,
                              validity_period INT NOT NULL,

                              commission DECIMAL(12,2) NOT NULL DEFAULT 0,
                              enabled BOOLEAN NOT NULL DEFAULT TRUE,
                              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Indexes for data bundles
CREATE INDEX idx_data_bundles_network ON data_bundles(network);
CREATE INDEX idx_data_bundles_price ON data_bundles(selling_price);
CREATE INDEX idx_data_bundles_data_amount ON data_bundles(data_amount);
CREATE INDEX idx_data_bundles_network_data_amount ON data_bundles(network, data_amount DESC);
CREATE INDEX idx_data_bundles_updated ON data_bundles(updated_at DESC);
