-- Add migration script here

CREATE TABLE api_providers (
                               api_id VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
                               name VARCHAR(100) NOT NULL,
                               url TEXT NOT NULL,
                               purpose TEXT NOT NULL,
                               api_key TEXT NOT NULL,
                               secret_key TEXT,
                               webhook_url TEXT,
                               is_active BOOLEAN NOT NULL DEFAULT TRUE,
                               timeout_seconds INT NOT NULL DEFAULT 30,
                               configuration JSONB DEFAULT '{}',
                               created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                               updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_api_providers_active ON api_providers(is_active);
CREATE INDEX idx_api_providers_updated ON api_providers(updated_at);

