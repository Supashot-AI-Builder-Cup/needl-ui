import type { LocalText } from '../i18n'

export type Severity = 'critical' | 'major' | 'minor' | 'pass'
export type Verdict = 'high' | 'safe'
export type SectionKey = 'store' | 'listing' | 'reviews'

/** Where a check was started from. */
export type Source = 'link' | 'shots'

/** One finished check in the local history list. */
export interface HistoryEntry {
  verificationId: string
  name: string
  image?: string | null
  price: string
  score: number
  verdict: Verdict
  checkedAt: string
}

export interface Product {
  name: string
  price: string
  was: string | null
  rating: string
  ratings: string
  sold: LocalText
  store: string
  mall: boolean
  loc: string
  /** Main product photo URL; null when unknown. */
  image?: string | null
  score: number
  verdict: Verdict
}

export interface BottleVariant {
  dropper?: string
  holo?: boolean
  thin?: boolean
}

export interface Fact {
  label: LocalText
  value: LocalText
}

export interface TextSegment {
  text: string
  flagged?: boolean
}

export interface Term {
  term: string
  note: LocalText
}

export interface Claim {
  name: LocalText
  detail: LocalText
  status: Severity
  label: LocalText
}

export interface Review {
  stars: number
  who: string
  text: string
}

export interface ComplaintRow {
  category: LocalText
  count: number
}

/** One evidence card shown under a check. */
export type Evidence =
  | { kind: 'facts'; caption?: LocalText; facts: Fact[] }
  | { kind: 'nameCompare'; caption?: LocalText; official: string; store: string; facts: Fact[] }
  | { kind: 'description'; caption: LocalText; segments: TextSegment[]; terms?: Term[] }
  | { kind: 'claims'; claims: Claim[] }
  | { kind: 'histogram'; caption: LocalText; values: number[]; hot: number[]; range: [string, string] }
  | { kind: 'reviews'; caption: LocalText; reviews: Review[] }
  | {
      kind: 'photoPair'
      listingCaption: LocalText
      buyerCaption: LocalText
      /** Real photo URLs; without them the illustration is drawn. */
      listingImage?: string | null
      buyerImage?: string | null
      buyerVariant?: BottleVariant
      diffs?: LocalText[]
      facts?: Fact[]
    }
  | {
      kind: 'complaints'
      rows: ComplaintRow[]
      quote?: { text: string; caption: LocalText }
      note?: LocalText
    }

export interface Check {
  code: string
  section: SectionKey
  severity: Severity
  name: LocalText
  summary: LocalText
  evidence: Evidence[]
}

/** One line of the checking log. `progress` is the job progress at which it is done. */
export interface Step {
  key: string
  label: LocalText
  progress: number
  /** Check code whose severity shows as the step result, or a special result. */
  result: { kind: 'check'; code: string } | { kind: 'stores' } | { kind: 'questions' }
}

export type StoreLogoName = 'dermalune' | 'glowmart' | 'kulitku'

export interface Store {
  name: string
  /** 'official' for the brand store, otherwise the Shopee badge (Star, Star+). */
  badge: string
  price: string
  rating: string
  sold: LocalText
  why: LocalText
  link: string
  logo: StoreLogoName
}

export type SlotKey = 'product' | 'store' | 'desc' | 'low' | 'new'

export interface ScreenshotSlotInfo {
  key: SlotKey
  required?: boolean
  title: LocalText
  hint: LocalText
  uses: LocalText
}

export interface ExtraShot {
  id: string
  name: string
  image: string
}

export type CheckIconName = 'store' | 'bot' | 'photo' | 'terms' | 'shield' | 'badge' | 'pin' | 'chat'

export interface CheckCatalogItem {
  name: LocalText
  icon: CheckIconName
}
