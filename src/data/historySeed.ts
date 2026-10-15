import type { HistoryEntry } from '../types/domain'
import { RISKY_LINK, SAFE_LINK } from './demoLinks'

/** History shown before the user has run any check. */
export const HISTORY_SEED: HistoryEntry[] = [
  { scenario: 'risky', name: null, link: RISKY_LINK },
  { scenario: 'safe', name: null, link: SAFE_LINK },
  {
    scenario: 'risky',
    name: 'Glowlab Vitamin C 20% Serum 20ml ORI BPOM',
    link: 'https://shopee.co.id/Glowlab-Vitamin-C-20-Serum-20ml-i.554120.88123',
  },
  {
    scenario: 'safe',
    name: 'Kulitku Ceramide Barrier Moisturizer 50ml',
    link: 'https://shopee.co.id/Kulitku-Ceramide-Moisturizer-50ml-i.218334561.99012',
  },
]
