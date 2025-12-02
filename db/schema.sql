-- Cryptid Directory Database Schema
-- Run with: wrangler d1 execute cryptid-db --local --file=./db/schema.sql

-- Drop existing tables (for fresh setup)
DROP TABLE IF EXISTS sighting_reports;
DROP TABLE IF EXISTS timeline_events;
DROP TABLE IF EXISTS testimonies;
DROP TABLE IF EXISTS cryptids;

-- Main cryptids table
CREATE TABLE cryptids (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  last_sighting TEXT,
  danger_level TEXT CHECK(danger_level IN ('Low', 'Medium', 'High')) NOT NULL,
  sightings INTEGER DEFAULT 0,
  description TEXT,
  image TEXT,
  tags TEXT, -- JSON array stored as text
  physical_description TEXT,
  behavior TEXT,
  habitat TEXT,
  diet TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Witness testimonies (one-to-many with cryptids)
CREATE TABLE testimonies (
  id TEXT PRIMARY KEY,
  cryptid_id TEXT NOT NULL,
  witness TEXT NOT NULL,
  date TEXT,
  location TEXT,
  account TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (cryptid_id) REFERENCES cryptids(id) ON DELETE CASCADE
);

-- Historical timeline events (one-to-many with cryptids)
CREATE TABLE timeline_events (
  id TEXT PRIMARY KEY,
  cryptid_id TEXT NOT NULL,
  year TEXT NOT NULL,
  event TEXT NOT NULL,
  location TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (cryptid_id) REFERENCES cryptids(id) ON DELETE CASCADE
);

-- User-submitted sighting reports (pending review)
CREATE TABLE sighting_reports (
  id TEXT PRIMARY KEY,
  status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  witness_name TEXT NOT NULL,
  email TEXT NOT NULL,
  date TEXT,
  time TEXT,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  creature_name TEXT,
  description TEXT NOT NULL,
  physical_description TEXT NOT NULL,
  behavior TEXT,
  photo_url TEXT,
  submitted_at TEXT DEFAULT (datetime('now')),
  reviewed_at TEXT,
  reviewer_notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_cryptids_region ON cryptids(region);
CREATE INDEX idx_cryptids_danger_level ON cryptids(danger_level);
CREATE INDEX idx_testimonies_cryptid ON testimonies(cryptid_id);
CREATE INDEX idx_timeline_cryptid ON timeline_events(cryptid_id);
CREATE INDEX idx_sighting_reports_status ON sighting_reports(status);

