import { describe, expect, it } from 'vitest'
import { dataUrlBytes, draftBytes, MAX_TOTAL_BYTES } from './screenshotForm'

const dataUrl = (bytes: number) => `data:image/png;base64,${btoa('\x07'.repeat(bytes))}`

describe('dataUrlBytes', () => {
  it.each([0, 1, 2, 3, 4, 5, 1000, 1001, 1002])('decodes the size of %i bytes', (bytes) => {
    expect(dataUrlBytes(dataUrl(bytes))).toBe(bytes)
  })

  it('accepts plain base64 without a data: prefix', () => {
    expect(dataUrlBytes(btoa('hello'))).toBe(5)
  })
})

describe('draftBytes', () => {
  it('adds up slots and extra screenshots', () => {
    const uploads = { product: dataUrl(100), store: dataUrl(250) }
    const extras = [{ id: 'x1', name: 'Seal', image: dataUrl(50) }]
    expect(draftBytes(uploads, extras)).toBe(400)
  })

  it('is zero for an empty draft', () => {
    expect(draftBytes({}, [])).toBe(0)
  })
})

describe('MAX_TOTAL_BYTES', () => {
  it('matches the API default of 30 MiB', () => {
    expect(MAX_TOTAL_BYTES).toBe(30 * 1024 * 1024)
  })
})
