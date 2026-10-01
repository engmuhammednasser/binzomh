import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

export function openDatabase(path: string) {
  const fullPath = resolve(path)
  mkdirSync(dirname(fullPath), { recursive: true, mode: 0o700 })
  const db = new DatabaseSync(fullPath)
  db.exec(`
    PRAGMA journal_mode=WAL;
    PRAGMA busy_timeout=5000;
    PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, email TEXT NOT NULL REFERENCES users(email), csrf TEXT NOT NULL, expires INTEGER NOT NULL, touched INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS workspace (id INTEGER PRIMARY KEY CHECK(id=1), draft TEXT NOT NULL, published TEXT NOT NULL, revision INTEGER NOT NULL, published_revision INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS revisions (id INTEGER PRIMARY KEY, draft TEXT NOT NULL, action TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS media (name TEXT PRIMARY KEY, data BLOB NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL);
  `)
  return db
}
