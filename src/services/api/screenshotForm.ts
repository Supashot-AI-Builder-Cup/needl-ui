import type { ExtraShot, SlotKey } from '../../types/domain'
import type { ApiLocale } from '../../types/api'

/** UI slot keys -> API field names (API_Contract.md, screenshot request). */
const FIELDS: Record<SlotKey, string> = {
  product: 'product',
  store: 'store',
  desc: 'description',
  low: 'low_reviews',
  new: 'newest_reviews',
}

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
/** All screenshots of one request together (the API default; Cloud Run caps requests at 32 MiB). */
export const MAX_TOTAL_BYTES = 30 * 1024 * 1024
export const MAX_EXTRA_SHOTS = 5

/** Size of the file behind a base64 data URL, without decoding it. */
export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',')
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  return Math.floor((base64.length * 3) / 4) - padding
}

/** Total size of the screenshots in the draft. */
export function draftBytes(uploads: Partial<Record<SlotKey, string>>, extras: ExtraShot[]): number {
  const images = [...Object.values(uploads), ...extras.map((x) => x.image)]
  return images.reduce((sum, image) => sum + (image ? dataUrlBytes(image) : 0), 0)
}

async function dataUrlToFile(dataUrl: string, name: string): Promise<File> {
  const blob = await (await fetch(dataUrl)).blob()
  const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'png'
  return new File([blob], `${name}.${ext}`, { type: blob.type })
}

/** The draft keeps images as data URLs; the API wants real files in multipart form data. */
export async function buildScreenshotForm(
  uploads: Partial<Record<SlotKey, string>>,
  extras: ExtraShot[],
  locale: ApiLocale,
): Promise<FormData> {
  const form = new FormData()
  for (const [slot, field] of Object.entries(FIELDS) as [SlotKey, string][]) {
    const dataUrl = uploads[slot]
    if (dataUrl) form.append(field, await dataUrlToFile(dataUrl, field))
  }
  for (const [i, extra] of extras.entries()) {
    form.append('extra_screenshots', await dataUrlToFile(extra.image, `extra-${i + 1}`))
    form.append('extra_names', extra.name.trim() || `Screenshot ${i + 1}`)
  }
  form.append('locale', locale)
  return form
}
