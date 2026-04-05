# Transaction Database Schema Analysis
## PostgreSQL Table Headers for Transaction System

Based on a comprehensive analysis of the Wondamart transaction system codebase, the following is the complete structure needed to represent all transaction types in a PostgreSQL database.

---

## 1. Core Transaction Table: `transactions`

### Primary Columns

| Column Name | Type | Nullable | Description | Use Cases |
|---|---|---|---|---|
| `tx_id` | VARCHAR(50) | NOT NULL (PK) | Unique transaction identifier with type prefix (e.g., `pd_`, `bp_`, `ap_`, `cp_`, `ad_`, `ac_`, `rf_`, `tx_`) | All transactions; prefix determines type |
| `agent_id` | VARCHAR(255) | NOT NULL | User ID / Agent ID who initiated the transaction | All transactions; used for agent filtering |
| `type` | ENUM | NOT NULL | Transaction type: `debit`, `paystack-deposit`, `manual-deposit`, `bundle-purchase`, `afa-purchase`, `checker-purchase`, `admin-debit`, `admin-credit`, `refund` | All transactions; primary categorization |
| `status` | ENUM | NOT NULL | Transaction status: `pending`, `processing`, `success`, `failed` | All transactions; workflow state |
| `amount` | DECIMAL(12,2) | NOT NULL | Transaction amount in base currency | All transactions; financial tracking |
| `balance` | DECIMAL(12,2) | NOT NULL | Agent wallet balance after transaction | All transactions; balance history |
| `commission` | DECIMAL(12,2) | YES | Commission earned by agent (if applicable) | `bundle-purchase`, `afa-purchase`, `checker-purchase`, deposits; incentive tracking |
| `api_id` | VARCHAR(50) | YES | API provider used for processing (e.g., Paystack, Hendylingks) | API filtering, provider analytics, troubleshooting |
| `time` | TIMESTAMP WITH TZ | NOT NULL | Transaction creation timestamp | All transactions; sorting, filtering by date range |
| `time_completed` | TIMESTAMP WITH TZ | YES | Transaction completion/resolution timestamp | Completed transactions; SLA tracking, processing time metrics |
| `created_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Database record creation timestamp | All transactions; audit trail |
| `updated_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Last update timestamp | All transactions; change tracking |

### Indexes
- PRIMARY KEY: `tx_id`
- INDEX: `agent_id, type, status` (composite - for transaction history queries)
- INDEX: `time DESC` (for chronological sorting)
- INDEX: `status, type` (for dashboard statistics)
- INDEX: `agent_id, time DESC` (for per-agent transaction history)

---

## 2. Transaction Data Storage: `transaction_data` (JSONB)

The `txData` field stores type-specific information. Instead of separate tables, use JSONB column:

| Column Name | Type | Description |
|---|---|---|
| `tx_id` | VARCHAR(50) | Foreign Key to transactions.tx_id |
| `data` | JSONB | Type-specific transaction data (see structures below) |

### Transaction Data Structures by Type

#### A. Bundle Purchase (`bundle-purchase`)
```jsonb
{
  "network": "mtn" | "telecel" | "airteltigo",
  "bundle_id": "string",
  "phone_number": "string (E.164 format)",
  "data_package": {
    "data": number (MB),
    "minutes": number (optional),
    "sms": number (optional)
  },
  "validity_period": number (days)
}
```
**Use Cases:** Data bundle sales tracking, network usage analysis, bundle popularity metrics

#### B. AFA Bundle Purchase (`afa-purchase`)
```jsonb
{
  "full_name": "string",
  "phone_number": "string",
  "id_number": "string",
  "date_of_birth": "date (YYYY-MM-DD)",
  "location": "string",
  "occupation": "string"
}
```
**Use Cases:** AFA/Financial service enrollment, KYC tracking, demographic analysis

#### C. Result Checker Purchase (`checker-purchase`)
```jsonb
{
  "checker_type": "BECE" | "WASSCE",
  "units": number
}
```
**Use Cases:** Exam result access sales, educational service tracking

#### D. Account Deposit / Paystack Deposit (`paystack-deposit`)
```jsonb
{
  "deposit_type": "paystack" | "send" | "momo",
  "phone_number": "string (optional, for some types)",
  "email": "string (for Paystack)",
  "network": "mtn" | "telecel" | "airteltigo" (for Paystack)",
  "transaction_id": "string (for send type)"
}
```
**Use Cases:** Wallet top-ups, payment method tracking, revenue reconciliation

#### E. Manual Deposit (`manual-deposit`)
```jsonb
{
  // Typically empty or contains:
  "notes": "string (optional)",
  "approver_id": "string (admin)"
}
```
**Use Cases:** Admin-assisted deposits, manual corrections, audit trail

#### F. Admin Transactions (`admin-debit`, `admin-credit`)
```jsonb
{
  "reason": "string",
  "admin_id": "string",
  "description": "string (optional)"
}
```
**Use Cases:** Manual adjustments, corrections, penalties, bonuses

#### G. Refund (`refund`)
```jsonb
{
  "original_tx_id": "string",
  "reason": "string",
  "refund_type": "full" | "partial",
  "refund_amount": number (if partial)
}
```
**Use Cases:** Transaction reversals, customer disputes, error corrections

#### H. Debit (`debit`)
```jsonb
{
  "description": "string (optional)",
  "reason": "string (optional)"
}
```
**Use Cases:** General wallet debits, service fees, penalties

---

## 3. Commission Tracking Table: `commissions`

Tracks aggregated commissions per agent per month:

| Column Name | Type | Nullable | Description | Use Cases |
|---|---|---|---|---|
| `commission_id` | VARCHAR(50) | NOT NULL (PK) | Unique commission record ID | Commission history tracking |
| `uid` | VARCHAR(255) | NOT NULL | Agent/User ID | Commission aggregation per agent |
| `year` | INT | NOT NULL | Commission year | Period grouping |
| `month_index` | INT (0-11) | NOT NULL | Month (0=January, 11=December) | Period grouping |
| `payed` | BOOLEAN | NOT NULL (DEFAULT FALSE) | Whether commission was paid out | Payment tracking |
| `end_of_month` | TIMESTAMP WITH TZ | NOT NULL | End of month timestamp | Determination of commissions payed |
| `updated_at` | TIMESTAMP WITH TZ | NOT NULL | Last update timestamp | Audit trail |
| `commissions_detail` | JSONB | YES | Array of commission objects | Detailed breakdown |

**commissions_detail JSONB Structure:**
```jsonb
[
  {
    "tx_id": "string",
    "commission": number,
    "date": "timestamp"
  }
]
```

### Indexes
- PRIMARY KEY: `commission_id`
- UNIQUE: `uid, year, month_index` (one record per agent per month)
- INDEX: `uid, payed` (for unpaid commissions per agent)
- INDEX: `end_of_month` (for month-end operations)

---

## 4. Data Bundles Table: `data_bundles`

Master table for all available data bundles across networks:

| Column Name | Type | Nullable | Description | Use Cases |
|---|---|---|---|---|
| `id` | VARCHAR(50) | NOT NULL (PK) | Unique bundle identifier | Bundle reference, API integration |
| `network` | VARCHAR(20) | NOT NULL | Network provider: `mtn`, `telecel`, `airteltigo` | Network filtering, provider analytics |
| `name` | VARCHAR(255) | YES | Human-readable bundle name | Display purposes, user selection |
| `price` | DECIMAL(12,2) | NOT NULL | Bundle price in base currency | Pricing calculations, revenue tracking |
| `data_amount` | INT | NOT NULL | Data amount in MB | Bundle specifications, user information |
| `minutes` | INT | YES | Voice minutes included | Bundle specifications |
| `sms` | INT | YES | SMS count included | Bundle specifications |
| `validity_period` | INT | NOT NULL | Validity period in days | Bundle specifications, expiration tracking |
| `commission` | DECIMAL(12,2) | NOT NULL | Agent commission per sale | Commission calculations |
| `enabled` | BOOLEAN | NOT NULL (DEFAULT TRUE) | Whether bundle is available for sale | Inventory management |
| `api_id` | VARCHAR(50) | YES | API provider for this bundle | API routing, provider management |
| `created_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Record creation timestamp | Audit trail |
| `updated_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Last update timestamp | Change tracking |

### Indexes
- PRIMARY KEY: `id`
- INDEX: `network, enabled` (for active bundles by network)
- INDEX: `api_id` (for API-based filtering)
- INDEX: `price` (for pricing queries)

---

## 5. Agent Stores Table: `agent_stores`

Physical or virtual locations where agents operate:

| Column Name | Type | Nullable | Description | Use Cases |
|---|---|---|---|---|
| `store_id` | VARCHAR(50) | NOT NULL (PK) | Unique store identifier | Store management, reporting |
| `name` | VARCHAR(255) | NOT NULL | Store name | Display, identification |
| `location` | VARCHAR(500) | YES | Physical address or location description | Geographic analysis, delivery |
| `manager_id` | VARCHAR(255) | YES | Manager/Owner user ID | Store management, hierarchy |
| `phone_number` | VARCHAR(20) | YES | Contact phone number | Communication, support |
| `email` | VARCHAR(255) | YES | Contact email address | Communication, notifications |
| `is_active` | BOOLEAN | NOT NULL (DEFAULT TRUE) | Whether store is operational | Active store filtering |
| `store_type` | VARCHAR(50) | YES | Type: `physical`, `virtual`, `mobile` | Categorization, analytics |
| `region` | VARCHAR(100) | YES | Geographic region | Regional reporting, distribution |
| `created_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Record creation timestamp | Audit trail |
| `updated_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Last update timestamp | Change tracking |

### Indexes
- PRIMARY KEY: `store_id`
- INDEX: `manager_id` (for manager-based queries)
- INDEX: `is_active, region` (for active stores by region)
- INDEX: `store_type` (for type-based filtering)

---

## 6. API Providers Table: `api_providers`

External API integrations for payment processing, bundle provisioning, etc.:

| Column Name | Type | Nullable | Description | Use Cases |
|---|---|---|---|---|
| `api_id` | VARCHAR(50) | NOT NULL (PK) | Unique API identifier | API reference, transaction linking |
| `name` | VARCHAR(100) | NOT NULL | API provider name (e.g., Paystack, Hendylingks) | Display, identification |
| `url` | VARCHAR(500) | YES | Base API URL/endpoint | API integration, configuration |
| `purpose` | VARCHAR(255) | NOT NULL | Primary purpose (e.g., payments, bundles, messaging) | Categorization, functionality |
| `api_key` | TEXT | YES | API key or authentication token | Secure API access |
| `secret_key` | TEXT | YES | Secret key for enhanced security | Secure API access |
| `webhook_url` | VARCHAR(500) | YES | Webhook endpoint for callbacks | Event handling, status updates |
| `is_active` | BOOLEAN | NOT NULL (DEFAULT TRUE) | Whether API is enabled | API management, failover |
| `rate_limit` | INT | YES | Requests per minute limit | Rate limiting, monitoring |
| `timeout_seconds` | INT | YES | Request timeout in seconds | Performance monitoring |
| `last_health_check` | TIMESTAMP WITH TZ | YES | Last health check timestamp | Monitoring, reliability |
| `health_status` | VARCHAR(20) | YES | Health status: `healthy`, `degraded`, `down` | System monitoring |
| `configuration` | JSONB | YES | Additional configuration parameters | Flexible API settings |
| `created_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Record creation timestamp | Audit trail |
| `updated_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Last update timestamp | Change tracking |

### Indexes
- PRIMARY KEY: `api_id`
- INDEX: `name` (for name-based lookups)
- INDEX: `purpose, is_active` (for active APIs by purpose)
- INDEX: `health_status` (for monitoring queries)

---

## 7. Query Patterns & Performance Considerations

### Frequently Used Query Patterns

1. **Agent Transaction History**
   ```sql
   SELECT * FROM transactions 
   WHERE agent_id = ? AND type = ? AND status = ?
   ORDER BY time DESC
   LIMIT ?
   ```
   - Index: `(agent_id, type, status, time DESC)`

2. **Dashboard Statistics - Pending Transactions by Network**
   ```sql
   SELECT data->>'network' as network, COUNT(*) as count, SUM(amount) as total
   FROM transactions t
   WHERE status = 'pending' AND type = 'bundle-purchase'
   GROUP BY data->>'network'
   ```
   - Index: `(status, type)` + JSONB path index on `data->>'network'`

3. **Transaction Filtering by Date Range**
   ```sql
   SELECT * FROM transactions 
   WHERE agent_id = ? AND time >= ? AND time <= ?
   ORDER BY time DESC
   ```
   - Index: `(agent_id, time DESC)`

4. **Amount-Based Queries**
   ```sql
   SELECT * FROM transactions 
   WHERE agent_id = ? AND amount >= ? AND amount <= ?
   ```
   - Index: `(agent_id, amount)`

5. **Commission Aggregations**
   ```sql
   SELECT uid, SUM(commission) as total_commission
   FROM transactions
   WHERE type IN ('bundle-purchase', 'afa-purchase', 'checker-purchase')
   AND status = 'success'
   AND EXTRACT(YEAR FROM time) = ? 
   AND EXTRACT(MONTH FROM time) = ?
   GROUP BY uid
   ```
   - Index: `(status, type, time DESC)`

---

## 8. Statistical & Reporting Considerations

### Key Metrics to Support

| Metric | Query Complexity | Use Case |
|---|---|---|
| Pending transactions by network | Medium | Dashboard statistics |
| Transaction success rate | Low | Quality metrics |
| Average processing time | Medium | SLA tracking |
| Commission earned per agent | Medium | Payroll automation |
| Revenue by transaction type | Low | Business analytics |
| Geographic distribution (phone networks) | Medium | Market analysis |
| Agent performance metrics | High | Leaderboards, incentives |

### Reporting Table Columns Needed
- `pending_mtn`, `pending_telecel`, `pending_airteltigo` (separate counts)
- `total_commissions_pending_payment`
- `success_count`, `failed_count`, `processing_count`
- `avg_processing_time_hours`

---

## 9. Data Integrity & Constraints

### NOT NULL Constraints
- `tx_id`, `agent_id`, `type`, `status`, `amount`, `balance`, `time`

### ENUM Constraints
- **type**: debit, paystack-deposit, manual-deposit, bundle-purchase, afa-purchase, checker-purchase, admin-debit, admin-credit, refund
- **status**: pending, processing, success, failed
- **network** (in JSONB): mtn, telecel, airteltigo

### Foreign Key Constraints
- `agent_id` → users table (if needed)
- `commission_id` → commission details (if normalized)

### Referential Integrity
- Refund transactions should reference `original_tx_id` that exists in transactions
- Admin actions should log `admin_id` for audit trail

---

## 10. Schema Summary SQL

### User Tables

```sql
-- Users table: Core user/agent information
CREATE TABLE users (
    uid VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_photo_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User wallets table: Simplified wallet/balance management
CREATE TABLE user_wallets (
    uid VARCHAR(255) PRIMARY KEY,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    commission DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);
```

### User Indexes

```sql
-- Users indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_name ON users(first_name, last_name);
CREATE INDEX idx_users_created_at_desc ON users(created_at DESC);

-- User wallets indexes
CREATE UNIQUE INDEX idx_user_wallets_uid ON user_wallets(uid);
```

### Transaction Tables

```sql
-- CREATE TYPE time_stamp AS (TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW());
CREATE TYPE transaction_type AS ENUM ('debit', 'paystack-deposit', 'manual-deposit', 'bundle-purchase', 'afa-purchase', 'checker-purchase', 'admin-debit', 'admin-credit', 'refund');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'success', 'failed');
CREATE TABLE transactions (
    tx_id VARCHAR(50) PRIMARY KEY UNIQUE,
    agent_id VARCHAR(255) REFERENCES users(agent_id) NOT NULL,
    type transaction_type NOT NULL,
    status transaction_status NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    commission DECIMAL(12,2),
    balance DECIMAL(12,2) REFERENCES user_wallets(agent_id).amount NOT NULL, -- Balance after transaction tied to the user's wallet
    api_id VARCHAR(50),
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    time_completed TIMESTAMP WITH TIME ZONE,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE commissions (
    commission_id VARCHAR(50) PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    month_index INT NOT NULL CHECK (month_index >= 0 AND month_index <= 11),
    payed BOOLEAN NOT NULL DEFAULT FALSE,
    end_of_month TIMESTAMP WITH TIME ZONE NOT NULL,
    commissions_detail JSONB,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(uid, year, month_index)
);

-- Products and API providers   
CREATE TABLE product_provider (
     id VARCHAR(50) PRIMARY KEY,
     product_id VARCHAR(50) NOT NULL,
     api_id VARCHAR(50) NOT NULL,
     cost_price DECIMAL(12,2) NOT NULL,
     is_primary BOOLEAN NOT NULL DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

     UNIQUE(product_id, api_id),  -- Only one pricing per bundle/api combo
     FOREIGN KEY (product_id) REFERENCES data_bundles(id) ON DELETE CASCADE,
     FOREIGN KEY (api_id) REFERENCES api_providers(api_id) ON DELETE CASCADE
);

CREATE INDEX idx_bundle_api_pricing_bundle_id ON bundle_api_pricing(bundle_id);
CREATE INDEX idx_bundle_api_pricing_api_id ON bundle_api_pricing(api_id);
CREATE INDEX idx_bundle_api_pricing_is_primary ON bundle_api_pricing(bundle_id, is_primary);

CREATE TYPE network_type AS ENUM ('mtn', 'telecel', 'airteltigo');
-- CREATE TYPE 
CREATE TABLE data_bundles (
    id VARCHAR(50) PRIMARY KEY,
    network network_type NOT NULL,
    name VARCHAR(255),
    price DECIMAL(12,2) NOT NULL,
    data_amount INT NOT NULL,
    minutes INT,
    sms INT,
    validity_period INT NOT NULL,
    commission DECIMAL(12,2) NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE agent_stores (
    store_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(500),
    manager_id VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    store_type VARCHAR(50),
    region VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE api_providers (
    api_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500),
    purpose VARCHAR(255) NOT NULL,
    api_key TEXT,
    secret_key TEXT,
    webhook_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rate_limit INT,
    timeout_seconds INT,
    last_health_check TIMESTAMP WITH TIME ZONE,
    health_status VARCHAR(20),
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_transactions_agent_type_status ON transactions(agent_id, type, status);
CREATE INDEX idx_transactions_time_desc ON transactions(time DESC);
CREATE INDEX idx_transactions_status_type ON transactions(status, type);
CREATE INDEX idx_transactions_agent_time ON transactions(agent_id, time DESC);
CREATE INDEX idx_commissions_uid_payed ON commissions(uid, payed);
CREATE INDEX idx_commissions_end_of_month ON commissions(end_of_month);

-- JSONB indexes for network filtering
CREATE INDEX idx_transactions_data_network ON transactions USING GIN (data);
CREATE INDEX idx_transactions_data_network_btree ON transactions((data->>'network')) WHERE type = 'bundle-purchase';

CREATE INDEX idx_data_bundles_network_enabled ON data_bundles(network, enabled);
CREATE INDEX idx_data_bundles_api_id ON data_bundles(api_id);
CREATE INDEX idx_data_bundles_price ON data_bundles(price);

CREATE INDEX idx_agent_stores_manager_id ON agent_stores(manager_id);
CREATE INDEX idx_agent_stores_is_active_region ON agent_stores(is_active, region);
CREATE INDEX idx_agent_stores_store_type ON agent_stores(store_type);

CREATE INDEX idx_api_providers_name ON api_providers(name);
CREATE INDEX idx_api_providers_purpose_is_active ON api_providers(purpose, is_active);
CREATE INDEX idx_api_providers_health_status ON api_providers(health_status);
```

---

## 11. User Management: `users` Table

Master table for all user/agent information:

| Column Name | Type | Nullable | Description | Use Cases |
|---|---|---|---|---|
| `uid` | VARCHAR(255) | NOT NULL (PK) | Unique user/agent identifier (Firebase UID) | User identification, transactions, commissions |
| `email` | VARCHAR(255) | NOT NULL (UNIQUE) | User email address | Authentication, notifications, contact |
| `phone_number` | VARCHAR(20) | YES (UNIQUE) | User phone number in E.164 format | Contact, verification, 2FA |
| `first_name` | VARCHAR(100) | NOT NULL | User first name | Display, identification |
| `last_name` | VARCHAR(100) | NOT NULL | User last name | Display, identification |
| `profile_photo_url` | VARCHAR(500) | YES | URL to user profile photo | Display purposes |
| `account_type` | ENUM | NOT NULL | Account type: `customer`, `agent`, `admin`, `super_admin` | Role-based access control |
| `is_active` | BOOLEAN | NOT NULL (DEFAULT TRUE) | Whether account is active/suspended | Account management |
| `email_verified` | BOOLEAN | NOT NULL (DEFAULT FALSE) | Email verification status | Authentication, compliance |
| `phone_verified` | BOOLEAN | NOT NULL (DEFAULT FALSE) | Phone verification status | Authentication, 2FA readiness |
| `last_login` | TIMESTAMP WITH TZ | YES | Last login timestamp | Activity tracking, security |
| `last_activity` | TIMESTAMP WITH TZ | YES | Last user activity timestamp | User engagement metrics |
| `metadata` | JSONB | YES | Additional user metadata (preferences, settings, etc.) | Flexible data storage |
| `created_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Account creation timestamp | Audit trail, user lifecycle |
| `updated_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Last update timestamp | Change tracking |

### Indexes
- PRIMARY KEY: `uid`
- UNIQUE INDEX: `email` (for login/registration)
- UNIQUE INDEX: `phone_number` (for phone-based login)
- INDEX: `is_active` (for role-based queries)
- INDEX: `is_active` (for compliance queries)
- INDEX: `created_at DESC` (for user creation analytics)

---

## 12. User Wallet: `user_wallets` Table

Simple wallet/balance management (ONE-TO-ONE with users):

| Column Name | Type | Nullable | Description | Use Cases |
|---|---|---|---|---|
| `uid` | VARCHAR(255) | NOT NULL (PK, FK) | Foreign Key to users.uid | Wallet-to-user mapping (one-to-one) |
| `amount` | DECIMAL(12,2) | NOT NULL (DEFAULT 0) | Current wallet balance | Real-time balance display |
| `commission` | DECIMAL(12,2) | NOT NULL (DEFAULT 0) | Commission earned | Agent earnings tracking |
| `created_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Wallet creation timestamp | Audit trail |
| `updated_at` | TIMESTAMP WITH TZ | NOT NULL (DEFAULT NOW()) | Last update timestamp | Change tracking |

### Indexes
- PRIMARY KEY: `uid` (one wallet per user)

---

## 13. Updated Foreign Key Relationships

### Relationship Map
```
users (uid) [UserDetails]
├── user_wallets (uid) - One-to-One
└── transactions (agent_id) - One-to-Many (User transactions)

commissions (uid) - References users.uid
data_bundles - Referenced by transactions
api_providers - Referenced by transactions
agent_stores (manager_id) - References users.uid
```

### Foreign Key Constraints

```sql
ALTER TABLE user_wallets ADD CONSTRAINT fk_user_wallets_uid 
FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE transactions ADD CONSTRAINT fk_transactions_agent_id 
FOREIGN KEY (agent_id) REFERENCES users(uid) ON DELETE RESTRICT;

ALTER TABLE commissions ADD CONSTRAINT fk_commissions_uid 
FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE RESTRICT;

ALTER TABLE agent_stores ADD CONSTRAINT fk_agent_stores_manager_id 
FOREIGN KEY (manager_id) REFERENCES users(uid) ON DELETE SET NULL;
```

---

## 11. Migration Path from Firestore

### Key Considerations
1. **Timestamp Conversion**: Firebase Timestamp → PostgreSQL TIMESTAMP WITH TIME ZONE
2. **JSONB Storage**: Nested objects stored as JSONB instead of separate tables
3. **Transaction Prefix Strategy**: Keep `tx_id` prefix for type identification
4. **Commission Aggregation**: Can be computed on-demand or stored as JSONB array

---

## Summary

This schema covers:
- ✅ **User Management** with `users` table (UserDetails)
- ✅ **User Wallet** with `user_wallets` table (uid, amount, commission, createdAt, updatedAt)
- ✅ **9 transaction types** with their specific data requirements
- ✅ **4 transaction statuses** for workflow tracking
- ✅ **3 network types** (MTN, Telecel, AirtelTigo) for statistics
- ✅ **Commission tracking** for agent payroll
- ✅ **Audit trails** with timestamps
- ✅ **Flexible JSONB storage** for transaction-specific data and user metadata
- ✅ **Performance optimization** with strategic indexing
- ✅ **Reporting support** for key business metrics
- ✅ **Data bundles management** with pricing and specifications
- ✅ **Agent stores management** with location and manager details
- ✅ **API providers management** with integration and security details
- ✅ **One-to-One relationship** for users to wallets
