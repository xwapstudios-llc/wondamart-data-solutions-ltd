-- Add migration script here

CREATE TABLE agent_stores (
                              store_id VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
                              agent_id INTEGER NOT NULL REFERENCES users(uid) ON DELETE CASCADE,

                              name VARCHAR(255) NOT NULL,
                              email VARCHAR(255),
                              phone_number VARCHAR(20),
                              is_phone_on_whatsapp BOOLEAN DEFAULT FALSE,

                              bundles JSONB NOT NULL DEFAULT '[]', -- List of bundle IDs available in the store
                              is_active BOOLEAN NOT NULL DEFAULT TRUE,
                              opening_time TIMESTAMPTZ,
                              closing_time TIMESTAMPTZ,

                              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
