import type { Product, Scenario } from '../types/domain'

export const PRODUCTS: Record<Scenario, Product> = {
  risky: {
    name: 'Dermalune 10% Niacinamide + Alpha Arbutin Brightening Serum 30ml ORIGINAL',
    price: 'Rp39.000',
    was: 'Rp129.000',
    rating: '4.9',
    ratings: '1,2RB',
    sold: { en: '2.4K', id: '2,4RB' },
    store: 'DermaIune 0fficial Shop',
    mall: false,
    loc: 'Kota Medan',
    score: 84,
    verdict: 'high',
  },
  safe: {
    name: 'Dermalune Niacinamide Brightening Serum 30ml',
    price: 'Rp129.000',
    was: null,
    rating: '4.9',
    ratings: '9,8RB',
    sold: { en: '18K', id: '18RB' },
    store: 'Dermalune Official Shop',
    mall: true,
    loc: 'Jakarta Barat',
    score: 9,
    verdict: 'safe',
  },
}
