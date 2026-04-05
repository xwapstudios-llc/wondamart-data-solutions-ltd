-- Add migration script here

CREATE TABLE api_providers (
                               api_id VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
                               name VARCHAR(100) NOT NULL,
                               url VARCHAR(500),
                               purpose VARCHAR(255) NOT NULL,
                               api_key TEXT,
                               secret_key TEXT,
                               webhook_url VARCHAR(500),
                               is_active BOOLEAN NOT NULL DEFAULT TRUE,
                               rate_limit INT,
                               timeout_seconds INT,
                               last_health_check TIMESTAMPTZ,
                               health_status VARCHAR(20),
                               configuration JSONB DEFAULT '{}',
                               created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                               updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_api_providers_active ON api_providers(is_active);
CREATE INDEX idx_api_providers_updated ON api_providers(updated_at);
