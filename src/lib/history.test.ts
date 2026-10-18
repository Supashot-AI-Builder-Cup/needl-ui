import { describe, expect, it } from 'vitest'
import { sanitizeHistory } from './history'
import type { HistoryEntry } from '../types/domain'

const entry: HistoryEntry = {
  verificationId: 'a6e0e73d-0000-4000-8000-000000000000',
  name: 'LViors Brightening Serum',
  image: 'https://down-id.img.susercontent.com/file/id-11134201-example',
  price: 'Rp2.000.000',
  score: 8,
  verdict: 'safe',
  checkedAt: '2026-10-17T13:58:41Z',
}

describe('sanitizeHistory', () => {
  it('keeps valid entries from localStorage', () => {
    expect(sanitizeHistory(JSON.parse(JSON.stringify([entry])))).toEqual([entry])
  })
})
