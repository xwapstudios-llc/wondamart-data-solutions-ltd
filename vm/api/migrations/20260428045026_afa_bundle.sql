-- Add migration script here

-- CREATE TYPE
CREATE TABLE afa_bundle (
                              id VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,

                              cost_price JSONB NOT NULL DEFAULT '[]', -- A list of cost prices from different API providers for this bundle, stored as [{"api_id": "api1", "price": 10.00}, {"api_id": "api2", "price": 9.50}]
                              selling_price DECIMAL(12,2) NOT NULL DEFAULT 0, -- Default selling price for agents if not specified by API provider
                              api_id VARCHAR(50) NOT NULL REFERENCES api_providers(api_id), -- API provider offering this bundle

                              commission DECIMAL(12,2) NOT NULL DEFAULT 0,
                              enabled BOOLEAN NOT NULL DEFAULT TRUE,
                              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);