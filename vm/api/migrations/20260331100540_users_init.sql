
DROP TABLE IF EXISTS user_wallets;
DROP TABLE IF EXISTS users;


-- Main Users table
CREATE TABLE users (
                       uid INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL ,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       phone_number VARCHAR(20) UNIQUE NOT NULL ,
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100),
                       profile_photo_url VARCHAR(500),
                       is_active BOOLEAN DEFAULT FALSE NOT NULL,
                       email_verified BOOLEAN DEFAULT FALSE NOT NULL,
                       phone_verified BOOLEAN DEFAULT FALSE NOT NULL,
                       last_login TIMESTAMPTZ DEFAULT NOW() NOT NULL,
                       last_activity TIMESTAMPTZ DEFAULT NOW() NOT NULL,
                       metadata JSONB DEFAULT '{}' NOT NULL,
                       created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
                       updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User Wallets table
CREATE TABLE user_wallets (
                              uid INTEGER PRIMARY KEY,
                              amount DECIMAL(12,2) NOT NULL DEFAULT 0,
                              commission DECIMAL(12,2) NOT NULL DEFAULT 0,
                              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                              FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

-- Users indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name ON users(first_name DESC, last_name DESC);
CREATE INDEX idx_users_created_at_desc ON users(created_at DESC);

-- User wallets indexes
CREATE UNIQUE INDEX idx_user_wallets_uid ON user_wallets(uid);
CREATE INDEX idx_user_wallets_amount ON user_wallets(amount);
CREATE INDEX idx_user_wallets_commission ON user_wallets(commission);
