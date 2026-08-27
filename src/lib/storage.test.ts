import { describe, expect, it } from 'vitest'
import type { StorageLike } from './storage'
import {
  DEFAULT_STATE,
  loadState,
  migrateState,
  saveState,
  STORAGE_KEY,
} from './storage'

class MemoryStorage implements StorageLike {
  values = new Map<string, string>()
  failReads = false
  failWrites = false

  getItem(key: string) {
    if (this.failReads) throw new Error('read blocked')
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string) {
    if (this.failWrites) throw new Error('write blocked')
    this.values.set(key, value)
  }

  removeItem(key: string) {
    this.values.delete(key)
  }
}

describe('local persistence', () => {
  it('returns defaults for an empty store', () => {
    const result = loadState(new MemoryStorage())
    expect(result.state).toEqual(DEFAULT_STATE)
    expect(result.issue).toBeNull()
  })

  it('migrates version 1 completion arrays and settings', () => {
    const state = migrateState({
      version: 1,
      settings: { locale: 'en', survivalCycleDay: 5 },
      completed: ['alliance-duel:2026-08-27:task-a'],
    })
    expect(state).toMatchObject({
      version: 2,
      preferences: { locale: 'en', survivalCycleDay: 5 },
      completions: { 'alliance-duel:2026-08-27:task-a': true },
    })
  })

  it('recovers explicitly from malformed data', () => {
    const storage = new MemoryStorage()
    storage.values.set(STORAGE_KEY, '{broken')
    const result = loadState(storage)
    expect(result.state).toEqual(DEFAULT_STATE)
    expect(result.issue?.code).toBe('invalid-data')
  })

  it('surfaces storage read and write failures', () => {
    const storage = new MemoryStorage()
    storage.failReads = true
    expect(loadState(storage).issue?.code).toBe('read-failed')
    storage.failReads = false
    storage.failWrites = true
    expect(saveState(storage, DEFAULT_STATE)?.code).toBe('write-failed')
  })
})
