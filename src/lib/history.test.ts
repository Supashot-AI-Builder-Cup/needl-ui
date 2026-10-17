import { describe, expect, it } from 'vitest'
import type { VerificationHistoryItem } from '../types/api'
import { historyEntryFromItem, sanitizeHistory } from './history'

const item: VerificationHistoryItem = {
  id: 'a6e0e73d-0000-4000-8000-000000000000',
  source_kind: 'url',
  source_url: 'https://shopee.co.id/product/1/2',
  name: 'LViors Brightening Serum',
  price: 'Rp2.000.000',
  image: 'https://down-id.img.susercontent.com/file/id-11134201-example',
  store_name: 'LViors Official',
  trust_score: 92,
  risk_level: 'safe',
  score: 8,
  verdict: 'safe',
  finding_count: 1,
  checked_at: '2026-10-17T13:58:41Z',
}

describe('historyEntryFromItem', () => {
  it('keeps the product image from the history API', () => {
    expect(historyEntryFromItem(item)).toEqual({
      verificationId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      score: 8,
      verdict: 'safe',
      checkedAt: item.checked_at,
    })
  })

  it('uses null when the server sends no image', () => {
    expect(historyEntryFromItem({ ...item, image: undefined }).image).toBeNull()
    expect(historyEntryFromItem({ ...item, image: null }).image).toBeNull()
  })

  it('produces entries that survive the localStorage round trip', () => {
    const entry = historyEntryFromItem(item)
    expect(sanitizeHistory(JSON.parse(JSON.stringify([entry])))).toEqual([entry])
  })
})
