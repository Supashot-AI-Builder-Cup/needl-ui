import type { ScreenshotSlotInfo } from '../types/domain'

export const SCREENSHOT_SLOTS: ScreenshotSlotInfo[] = [
  {
    key: 'product',
    required: true,
    title: { en: 'Product page', id: 'Halaman produk' },
    hint: { en: 'Main photo, name, price', id: 'Foto utama, nama, harga' },
    uses: { en: 'Preview, Buyer photos', id: 'Pratinjau, Foto pembeli' },
  },
  {
    key: 'store',
    required: true,
    title: { en: 'Store header', id: 'Header toko' },
    hint: { en: 'Store name, badge, rating, followers', id: 'Nama toko, badge, rating, pengikut' },
    uses: { en: 'Store name', id: 'Nama toko' },
  },
  {
    key: 'desc',
    title: { en: 'Full description', id: 'Deskripsi lengkap' },
    hint: { en: 'Show the BPOM and claims', id: 'Tampilkan BPOM dan klaim' },
    uses: { en: 'Risky terms, Claims', id: 'Istilah berisiko, Klaim' },
  },
  {
    key: 'low',
    title: { en: 'Low-star reviews', id: 'Ulasan bintang rendah' },
    hint: { en: '1 to 3 stars, with photos', id: 'Bintang 1 sampai 3, dengan foto' },
    uses: { en: 'Safety complaints, Buyer photos', id: 'Keluhan keamanan, Foto pembeli' },
  },
  {
    key: 'new',
    title: { en: 'Newest reviews', id: 'Ulasan terbaru' },
    hint: { en: 'Sort by newest', id: 'Urutkan terbaru' },
    uses: { en: 'Fake reviews', id: 'Ulasan palsu' },
  },
]
