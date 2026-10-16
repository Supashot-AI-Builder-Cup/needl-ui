import { RISKY_LINK, SAFE_LINK, SAFE_SHOP_ID } from '../data/demoLinks'
import type { Scenario } from '../types/domain'

export type ParseLinkResult =
  | { ok: false; error: 'errEmpty' | 'errLink' }
  | { ok: true; scenario: Scenario; name: string | null; isDemo: boolean; link: string }

export type ValidLink = Extract<ParseLinkResult, { ok: true }>

const SHOPEE_HOST = /(^|\.)shopee\.(co\.id|com|sg|com\.my|ph|vn|co\.th)$/i
const SHORT_HOST = /(^|\.)shp\.ee$/i

/** Validate a pasted Shopee link and work out which mock scenario it maps to. */
export function parseLink(raw: string): ParseLinkResult {
  if (!raw.trim()) return { ok: false, error: 'errEmpty' }

  const match = raw.match(/https?:\/\/[^\s]+/i)
  let str = match ? match[0] : raw.trim()
  if (!/^https?:\/\//i.test(str)) str = 'https://' + str

  let url: URL
  try {
    url = new URL(str)
  } catch {
    return { ok: false, error: 'errLink' }
  }
  if (!SHOPEE_HOST.test(url.hostname) && !SHORT_HOST.test(url.hostname)) return { ok: false, error: 'errLink' }

  const scenario: Scenario = (url.pathname + url.search).includes(SAFE_SHOP_ID) ? 'safe' : 'risky'
  const isDemo = str.startsWith(RISKY_LINK) || str.startsWith(SAFE_LINK)
  return { ok: true, scenario, name: isDemo ? null : nameFromPath(url.pathname), isDemo, link: str }
}

/** "Brand-Serum-30ml-i.123.456" -> "Brand Serum 30ml" */
function nameFromPath(pathname: string): string | null {
  let seg: string
  try {
    seg = decodeURIComponent(pathname.split('/').filter(Boolean)[0] || '')
  } catch {
    return null
  }
  const slug = seg.replace(/-i\.\d+\.\d+$/, '')
  if (!slug || slug === seg || slug.length <= 6) return null
  return slug.replace(/-+/g, ' ').replace(/\s+/g, ' ').trim()
}
