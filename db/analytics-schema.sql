-- Analytics tracking table
-- Run with: wrangler d1 execute cryptid-db --local --file=./db/analytics-schema.sql

CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  page TEXT NOT NULL,
  cryptid TEXT,
  referrer TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes separately
CREATE INDEX IF NOT EXISTS idx_analytics_page ON analytics(page);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);

-- Popular cryptids view
CREATE VIEW IF NOT EXISTS popular_cryptids AS
SELECT
  cryptid,
  COUNT(*) as views,
  MAX(timestamp) as last_viewed
FROM analytics
WHERE event = 'page_view' AND cryptid IS NOT NULL
GROUP BY cryptid
ORDER BY views DESC;

-- Daily page views
CREATE VIEW IF NOT EXISTS daily_views AS
SELECT
  DATE(timestamp) as date,
  page,
  COUNT(*) as views
FROM analytics
WHERE event = 'page_view'
GROUP BY DATE(timestamp), page
ORDER BY date DESC, views DESC;
