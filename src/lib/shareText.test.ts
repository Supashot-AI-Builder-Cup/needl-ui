import { describe, expect, it } from 'vitest'
import { buildShareText, resultUrl } from './shareText'

describe('resultUrl', () => {
  it('links to the public result page', () => {
    expect(resultUrl('https://needl.example.com', '6bd923f6-5d89-48e0-850e-8e6d71dd19e5')).toBe(
      'https://needl.example.com/check/6bd923f6-5d89-48e0-850e-8e6d71dd19e5',
    )
  })

  it('encodes the id', () => {
    expect(resultUrl('https://x.app', 'a/b c')).toBe('https://x.app/check/a%2Fb%20c')
  })
})

describe('buildShareText', () => {
  const base = { name: 'Dermalune Serum', verdict: 'High risk', score: 84, counts: ['3 Critical', '3 Major'] }

  it('ends with the result link', () => {
    expect(buildShareText({ ...base, link: 'https://x.app/check/1' })).toBe(
      'needl: Dermalune Serum\nHigh risk, 84/100 (3 Critical, 3 Major)\nhttps://x.app/check/1',
    )
  })

  it('leaves the link out when the share sheet adds it', () => {
    expect(buildShareText({ ...base, counts: [], link: null })).toBe('needl: Dermalune Serum\nHigh risk, 84/100')
  })
})
