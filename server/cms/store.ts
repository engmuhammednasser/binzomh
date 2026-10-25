import type { DatabaseSync } from 'node:sqlite'
import { createError } from 'h3'
import { openDatabase } from './database'
import { seedWorkspace, normalizeWorkspace } from './seed'
import type { Revision, Workspace, WorkspaceResponse } from '../../types/cms'

let database: DatabaseSync | undefined
export function cmsDatabase(path: string) {
  if (!database) database = openDatabase(path)
  return database
}
interface StoredWorkspace { draft: string, published: string, revision: number, published_revision: number }
export function storedWorkspace(db: DatabaseSync): StoredWorkspace {
  const existing = db.prepare('SELECT * FROM workspace WHERE id=1').get() as unknown as StoredWorkspace | undefined
  if (existing) return existing
  const seed = JSON.stringify(seedWorkspace())
  db.prepare('INSERT OR IGNORE INTO workspace VALUES(1,?,?,0,0)').run(seed, seed)
  db.prepare('INSERT OR IGNORE INTO revisions VALUES(0,?,?,?)').run(seed, 'initial', new Date().toISOString())
  return db.prepare('SELECT * FROM workspace WHERE id=1').get() as unknown as StoredWorkspace
}
export function workspaceResponse(db: DatabaseSync): WorkspaceResponse {
  const row = storedWorkspace(db)
  return {
    draft: normalizeWorkspace(JSON.parse(row.draft)), revision: row.revision, publishedRevision: row.published_revision,
    history: db.prepare('SELECT id, action, created_at AS createdAt FROM revisions ORDER BY id DESC LIMIT 30').all() as unknown as Revision[],
  }
}
export function reviseWorkspace(db: DatabaseSync, expected: unknown, action: 'save' | 'publish' | 'restore', draft?: Workspace) {
  db.exec('BEGIN IMMEDIATE')
  try {
    const row = storedWorkspace(db)
    if (!Number.isSafeInteger(expected) || expected !== row.revision) throw createError({ statusCode: 409, statusMessage: 'A newer revision exists. Reload before saving.' })
    const value = draft ? JSON.stringify(draft) : row.draft
    const id = row.revision + 1
    if (action === 'publish') db.prepare('UPDATE workspace SET published=?, published_revision=?, revision=? WHERE id=1').run(value, id, id)
    else db.prepare('UPDATE workspace SET draft=?, revision=? WHERE id=1').run(value, id)
    db.prepare('INSERT INTO revisions VALUES(?,?,?,?)').run(id, value, action, new Date().toISOString())
    db.exec('COMMIT')
  }
  catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
  return workspaceResponse(db)
}
