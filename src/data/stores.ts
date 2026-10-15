import type { Store } from '../types/domain'
import { SAFE_LINK } from './demoLinks'

/** Safer stores suggested when the listing looks risky. */
export const STORES: Store[] = [
  {
    name: 'Dermalune Official Shop',
    badge: 'official',
    price: 'Rp129.000',
    rating: '4.9',
    sold: { en: '18K sold', id: '18RB terjual' },
    why: { en: 'The brand’s own Shopee Mall store.', id: 'Toko brand di Shopee Mall.' },
    link: SAFE_LINK,
    logo: 'dermalune',
  },
  {
    name: 'Glowmart Indonesia',
    badge: 'Star+',
    price: 'Rp119.000',
    rating: '4.8',
    sold: { en: '6.1K sold', id: '6,1RB terjual' },
    why: {
      en: 'Normal reviews, matching BPOM. Backup if official is out of stock.',
      id: 'Ulasan wajar, BPOM cocok. Cadangan jika toko resmi habis.',
    },
    link: 'https://shopee.co.id/glowmart.indonesia',
    logo: 'glowmart',
  },
  {
    name: 'Kulitku Beauty',
    badge: 'Star',
    price: 'Rp124.000',
    rating: '4.8',
    sold: { en: '3.4K sold', id: '3,4RB terjual' },
    why: { en: 'No risky terms. Buyer photos match.', id: 'Tanpa istilah berisiko. Foto pembeli cocok.' },
    link: 'https://shopee.co.id/kulitku.beauty',
    logo: 'kulitku',
  },
]
