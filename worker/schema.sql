-- 最新消息
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  urls TEXT DEFAULT '[]',
  image_url TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 課程
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  teacher TEXT DEFAULT '',
  location TEXT DEFAULT '',
  price INTEGER DEFAULT 0,
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  capacity INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  description TEXT DEFAULT '',
  urls TEXT DEFAULT '[]',
  image_url TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 成員
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  introduction TEXT DEFAULT '',
  tags TEXT DEFAULT '[]',
  urls TEXT DEFAULT '[]',
  image_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 活動花絮
CREATE TABLE IF NOT EXISTS photo_albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 課程報名
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  participants INTEGER DEFAULT 1,
  total_fee INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_news_updated_at ON news(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_updated_at ON courses(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(active);
CREATE INDEX IF NOT EXISTS idx_members_sort_order ON members(sort_order);
CREATE INDEX IF NOT EXISTS idx_photo_albums_updated_at ON photo_albums(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_course_id ON registrations(course_id);
