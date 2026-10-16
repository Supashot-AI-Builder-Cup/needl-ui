export type ParseLinkResult = { ok: false; error: 'errEmpty' | 'errLink' } | { ok: true; link: string }

export type ValidLink = Extract<ParseLinkResult, { ok: true }>

const SHOPEE_HOST = /(^|\.)shopee\.co\.id$/i
const SHORT_HOST = /(^|\.)shp\.ee$/i
const PRODUCT_PATH = /-i\.\d+\.\d+(?!\d)|^\/product\/\d+\/\d+/

/**
 * Quick check before calling the API: a shopee.co.id product link or a shp.ee
 * short link. The server validates again and has the final say.
 */
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
  if (SHORT_HOST.test(url.hostname) && url.pathname.length > 1) return { ok: true, link: str }
  if (!SHOPEE_HOST.test(url.hostname) || !PRODUCT_PATH.test(decodeURIComponent(url.pathname))) {
    return { ok: false, error: 'errLink' }
  }
  return { ok: true, link: str }
}
