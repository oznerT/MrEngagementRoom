-- Schema for D1 Database 'signatures' (v2 Collective)

DROP TABLE IF EXISTS tiles;
DROP TABLE IF EXISTS strokes;

CREATE TABLE tiles (
  id TEXT PRIMARY KEY,           -- Unique Tile ID (e.g. "x-y" or uuid)
  x REAL,                        -- Normalized X position (0..1) on global canvas
  y REAL,                        -- Normalized Y position (0..1) on global canvas
  w REAL,                        -- Normalized Width
  h REAL,                        -- Normalized Height
  claimed_at INTEGER,            -- Timestamp when claimed
  used INTEGER DEFAULT 0         -- 0 = Empty/Claimed, 1 = Filled/Submitted
);

CREATE TABLE strokes (
  id TEXT PRIMARY KEY,           -- UUID
  created_at INTEGER,            -- Timestamp
  tile_id TEXT,                  -- Foreign Key to tiles.id
  strokes_json TEXT,             -- JSON: Array of normalized points (0..1 relative to Tile)
  points_count INTEGER,
  ua TEXT,
  ip_hash TEXT
);

CREATE INDEX idx_strokes_tile ON strokes(tile_id);
CREATE INDEX idx_tiles_used ON tiles(used);
