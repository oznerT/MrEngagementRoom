-- Schema for D1 Database 'signatures'

DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
  id TEXT PRIMARY KEY,           -- Unique ID (UUIDv4)
  created_at INTEGER,            -- Unix timestamp (ms)
  strokes TEXT,                  -- JSON string of normalized strokes
  points_count INTEGER,          -- Total number of points in drawing
  ua TEXT,                       -- User Agent
  ip_hash TEXT                   -- Hashed IP for rate limiting
);

CREATE INDEX idx_created_at ON signatures(created_at);
