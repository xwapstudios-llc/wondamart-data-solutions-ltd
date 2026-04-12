-- Add migration script here

ALTER TABLE If Exists  api_providers DROP COLUMN IF EXISTS rate_limit;
ALTER TABLE If Exists  api_providers DROP COLUMN IF EXISTS last_health_check;
ALTER TABLE If Exists  api_providers DROP COLUMN IF EXISTS health_status;