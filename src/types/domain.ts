import type { LocalText } from '../i18n'

export type Scenario = 'risky' | 'safe'
export type Severity = 'critical' | 'major' | 'minor' | 'pass'
export type Verdict = 'high' | 'safe'
export type SectionKey = 'store' | 'listing' | 'reviews'

/** Where the current check came from. */
export type Source = 'link' | 'shots' | 'history'

/** The listing being checked. */
export interface Subject {
  scenario: Scenario
  /** Name taken from the link slug; null means use the mock product name. */
  name: string | null
  link: string | null
  source: Source
}

export interface HistoryEntry {
  scenario: Scenario
  name: string | null
  link: string | null
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
  | { kind: 'nameCompare'; caption?: LocalText; official: string; store: string; facts: Fact[] }
  | { kind: 'description'; caption: LocalText; segments: TextSegment[]; terms?: Term[] }
  | { kind: 'claims'; claims: Claim[] }
  | { kind: 'histogram'; caption: LocalText; values: number[]; hot: number[]; range: [string, string] }
  | { kind: 'reviews'; caption: LocalText; reviews: Review[] }
  | {
      kind: 'photoPair'
      listingCaption: LocalText
      buyerCaption: LocalText
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
  section: SectionKey
  severity: Severity
  name: LocalText
  summary: LocalText
  evidence: Evidence[]
}

export interface Step {
  key: string
  label: LocalText
  result: Record<Scenario, LocalText>
  severity: Record<Scenario, Severity>
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
