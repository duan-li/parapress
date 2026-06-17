-- parapress blog table. D1 = SQLite.
-- All timestamps stored as ISO8601 UTC strings (e.g. 2026-06-17T08:00:00Z).
-- Lexicographic order matches time order, so published_at <= now comparisons work correctly for UTC ISO strings.

CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT    NOT NULL UNIQUE,
  title        TEXT    NOT NULL,
  body         TEXT    NOT NULL DEFAULT '',   -- raw markdown
  excerpt      TEXT,                          -- list/RSS summary, nullable
  status       TEXT    NOT NULL DEFAULT 'draft', -- 'draft' | 'published'
  published_at TEXT,                          -- scheduled/actual publish time (UTC ISO8601); nullable for drafts
  created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

-- Public list query: WHERE status='published' AND published_at<=now ORDER BY published_at DESC
CREATE INDEX IF NOT EXISTS idx_posts_status_published
  ON posts (status, published_at DESC);
