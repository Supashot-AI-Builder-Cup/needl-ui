import type { CheckCatalogItem } from '../types/domain'

/** Every check needl runs, shown in "What needl checks" on the home page. */
export const CHECK_CATALOG: CheckCatalogItem[] = [
  { name: { en: 'Store name', id: 'Nama toko' }, icon: 'store' },
  { name: { en: 'Fake reviews', id: 'Ulasan palsu' }, icon: 'bot' },
  { name: { en: 'Buyer photos', id: 'Foto pembeli' }, icon: 'photo' },
  { name: { en: 'Risky terms', id: 'Istilah berisiko' }, icon: 'terms' },
  { name: { en: 'Safety complaints', id: 'Keluhan keamanan' }, icon: 'shield' },
  { name: { en: 'Claims', id: 'Klaim' }, icon: 'badge' },
  { name: { en: 'Safer stores', id: 'Toko lebih aman' }, icon: 'pin' },
  { name: { en: 'Seller questions', id: 'Pertanyaan ke penjual' }, icon: 'chat' },
]
