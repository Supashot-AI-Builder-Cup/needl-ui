import type { Check, Scenario } from '../types/domain'
import { CHECK_NAMES } from './checkCatalog'
import { DIGEST_CATEGORIES as CAT } from './digestCategories'

const FROM_DESCRIPTION = { en: 'From the description', id: 'Dari deskripsi' }
const DAILY_REVIEWS = { en: 'Daily reviews, last 14 days', id: 'Ulasan harian, 14 hari terakhir' }
const LISTING_PHOTO = { en: 'Listing photo', id: 'Foto listing' }
const MALL_BADGE = { en: 'Shopee Mall badge', id: 'Badge Shopee Mall' }
const STORE_JOINED = { en: 'Store joined', id: 'Toko bergabung' }
const SHIPS_FROM = { en: 'Ships from', id: 'Dikirim dari' }
const DERM_TESTED = { en: 'Dermatologically tested', id: 'Teruji dermatologis' }
const NO_PROOF = { en: 'No proof', id: 'Tanpa bukti' }
const VERIFIED = { en: 'Verified', id: 'Terverifikasi' }

export const CHECKS: Record<Scenario, Check[]> = {
  risky: [
    {
      section: 'store',
      severity: 'critical',
      name: CHECK_NAMES.storeName,
      summary: {
        en: 'Copies the brand name. Capital I replaces l, zero replaces O.',
        id: 'Meniru nama brand. I kapital ganti l, angka 0 ganti O.',
      },
      evidence: [
        {
          kind: 'nameCompare',
          caption: { en: 'Capital I and lowercase l look alike.', id: 'I kapital dan l kecil terlihat sama.' },
          official: 'Dermalune Official Shop',
          store: 'DermaIune 0fficial Shop',
          facts: [
            { label: MALL_BADGE, value: { en: 'No', id: 'Tidak ada' } },
            { label: STORE_JOINED, value: { en: '2 months ago', id: '2 bulan lalu' } },
            { label: SHIPS_FROM, value: 'Kota Medan (brand: Jakarta)' },
          ],
        },
      ],
    },
    {
      section: 'listing',
      severity: 'critical',
      name: CHECK_NAMES.riskyTerms,
      summary: {
        en: '3 terms linked to repacked or unofficial stock.',
        id: '3 istilah terkait barang repack atau tidak resmi.',
      },
      evidence: [
        {
          kind: 'description',
          caption: FROM_DESCRIPTION,
          segments: [
            { text: 'Serum niacinamide 10% ORIGINAL 100% ' },
            { text: 'bukan KW', flagged: true },
            { text: ' ✨ Isi 30ml, ' },
            { text: 'share in jar', flagged: true },
            { text: ' dari botol besar biar lebih hemat. Dikirim ' },
            { text: 'tanpa box', flagged: true },
            { text: ' untuk menekan harga. Ready banyak, langsung kirim!' },
          ],
          terms: [
            {
              term: 'bukan KW',
              note: { en: 'Genuine sellers rarely need to say this.', id: 'Penjual asli jarang menulis ini.' },
            },
            {
              term: 'share in jar',
              note: {
                en: 'Moved to another bottle. Seal and batch can’t be checked.',
                id: 'Dipindah ke botol lain. Segel dan batch tak bisa dicek.',
              },
            },
            {
              term: 'tanpa box',
              note: {
                en: 'No box, so no BPOM number or expiry to check.',
                id: 'Tanpa box, jadi tak ada BPOM atau tanggal kedaluwarsa.',
              },
            },
          ],
        },
      ],
    },
    {
      section: 'listing',
      severity: 'major',
      name: CHECK_NAMES.claims,
      summary: {
        en: '2 of 3 claims unverified. The BPOM number is for another product.',
        id: '2 dari 3 klaim tak terverifikasi. Nomor BPOM milik produk lain.',
      },
      evidence: [
        {
          kind: 'claims',
          claims: [
            {
              name: 'BPOM',
              detail: {
                en: 'NA18230105421 belongs to a Dermalune toner.',
                id: 'NA18230105421 milik toner Dermalune.',
              },
              status: 'critical',
              label: { en: 'Mismatch', id: 'Tidak cocok' },
            },
            {
              name: 'Halal',
              detail: { en: 'No certificate number.', id: 'Tidak ada nomor sertifikat.' },
              status: 'major',
              label: { en: 'Not shown', id: 'Tidak ada' },
            },
            {
              name: DERM_TESTED,
              detail: { en: 'No proof given.', id: 'Tanpa bukti.' },
              status: 'minor',
              label: NO_PROOF,
            },
          ],
        },
      ],
    },
    {
      section: 'reviews',
      severity: 'critical',
      name: CHECK_NAMES.fakeReviews,
      summary: {
        en: '64 five-star reviews in 36 hours. 41 use the same sentence.',
        id: '64 ulasan bintang 5 dalam 36 jam. 41 memakai kalimat sama.',
      },
      evidence: [
        {
          kind: 'histogram',
          caption: DAILY_REVIEWS,
          values: [2, 1, 3, 2, 1, 2, 38, 26, 3, 2, 1, 2, 1, 2],
          hot: [6, 7],
          range: ['8 Sep', '21 Sep'],
        },
        {
          kind: 'reviews',
          caption: {
            en: '3 of 41 matching reviews, minutes apart',
            id: '3 dari 41 ulasan serupa, berselang menit',
          },
          reviews: [
            {
              stars: 5,
              who: 's*****a, 14 Sep 21:04',
              text: 'Barang bagus sesuai deskripsi, pengiriman cepat, recommended seller!',
            },
            { stars: 5, who: 'r****7, 14 Sep 21:06', text: 'barang bagus sesuai deskripsi pengiriman cepat recommended' },
            {
              stars: 5,
              who: 'd*****i, 14 Sep 21:09',
              text: 'Barang bagus, sesuai deskripsi. Pengiriman cepat. Recommended!!',
            },
          ],
        },
      ],
    },
    {
      section: 'reviews',
      severity: 'major',
      name: CHECK_NAMES.buyerPhotos,
      summary: {
        en: '7 buyer photos don’t match. Listing photos are copied from the official store.',
        id: '7 foto pembeli tidak cocok. Foto listing disalin dari toko resmi.',
      },
      evidence: [
        {
          kind: 'photoPair',
          listingCaption: LISTING_PHOTO,
          buyerCaption: { en: 'Buyer photo, 17 Sep', id: 'Foto pembeli, 17 Sep' },
          buyerVariant: { dropper: '#2A2A2A', holo: false, thin: true },
          diffs: [
            { en: 'No hologram sticker', id: 'Tanpa stiker hologram' },
            { en: 'Black dropper, not white', id: 'Pipet hitam, bukan putih' },
            { en: 'Thinner label text', id: 'Huruf label lebih tipis' },
          ],
          facts: [
            {
              label: { en: 'Listing photos found on the official store', id: 'Foto listing ada di toko resmi' },
              value: { en: '4 of 5', id: '4 dari 5' },
            },
          ],
        },
      ],
    },
    {
      section: 'reviews',
      severity: 'major',
      name: CHECK_NAMES.safetyComplaints,
      summary: {
        en: '38 low-star reviews. Top complaint: skin irritation.',
        id: '38 ulasan bintang rendah. Keluhan utama: iritasi kulit.',
      },
      evidence: [
        {
          kind: 'complaints',
          rows: [
            { category: CAT.irritation, count: 14 },
            { category: CAT.texture, count: 11 },
            { category: CAT.seal, count: 6 },
            { category: CAT.wrongItem, count: 4 },
            { category: CAT.expired, count: 3 },
            { category: CAT.digestive, count: 0 },
          ],
          quote: {
            text: 'Pakai 2 hari langsung merah dan perih, padahal biasanya cocok sama serum ini.',
            caption: { en: '1-star review, 19 Sep', id: 'Ulasan bintang 1, 19 Sep' },
          },
        },
      ],
    },
  ],
  safe: [
    {
      section: 'store',
      severity: 'pass',
      name: CHECK_NAMES.storeName,
      summary: {
        en: 'Official brand store with the Shopee Mall badge.',
        id: 'Toko resmi brand dengan badge Shopee Mall.',
      },
      evidence: [
        {
          kind: 'nameCompare',
          official: 'Dermalune Official Shop',
          store: 'Dermalune Official Shop',
          facts: [
            { label: MALL_BADGE, value: { en: 'Yes', id: 'Ada' } },
            { label: STORE_JOINED, value: { en: '4 years ago', id: '4 tahun lalu' } },
            { label: SHIPS_FROM, value: 'Jakarta Barat' },
          ],
        },
      ],
    },
    {
      section: 'listing',
      severity: 'pass',
      name: CHECK_NAMES.riskyTerms,
      summary: { en: 'No risky terms found.', id: 'Tidak ada istilah berisiko.' },
      evidence: [
        {
          kind: 'description',
          caption: FROM_DESCRIPTION,
          segments: [
            {
              text: 'Dermalune Niacinamide Brightening Serum 30ml. Diformulasikan dengan 10% niacinamide dan alpha arbutin untuk membantu meratakan warna kulit. Terdaftar BPOM NA18230107788. Bersertifikat Halal.',
            },
          ],
        },
      ],
    },
    {
      section: 'listing',
      severity: 'minor',
      name: CHECK_NAMES.claims,
      summary: {
        en: 'BPOM and Halal verified. “Dermatologically tested” has no proof.',
        id: 'BPOM dan Halal terverifikasi. “Teruji dermatologis” tanpa bukti.',
      },
      evidence: [
        {
          kind: 'claims',
          claims: [
            {
              name: 'BPOM',
              detail: {
                en: 'NA18230107788 matches this serum.',
                id: 'NA18230107788 cocok dengan serum ini.',
              },
              status: 'pass',
              label: VERIFIED,
            },
            {
              name: 'Halal',
              detail: {
                en: 'Certificate ID00410000123450324 is valid.',
                id: 'Sertifikat ID00410000123450324 berlaku.',
              },
              status: 'pass',
              label: VERIFIED,
            },
            {
              name: DERM_TESTED,
              detail: {
                en: 'Marketing claim. Nothing to verify.',
                id: 'Klaim pemasaran. Tak ada yang bisa dicek.',
              },
              status: 'minor',
              label: NO_PROOF,
            },
          ],
        },
      ],
    },
    {
      section: 'reviews',
      severity: 'pass',
      name: CHECK_NAMES.fakeReviews,
      summary: { en: 'Steady pace, varied wording.', id: 'Ritme wajar, kalimat beragam.' },
      evidence: [
        {
          kind: 'histogram',
          caption: DAILY_REVIEWS,
          values: [22, 18, 25, 20, 27, 19, 23, 24, 21, 26, 20, 22, 25, 23],
          hot: [],
          range: ['8 Sep', '21 Sep'],
        },
      ],
    },
    {
      section: 'reviews',
      severity: 'pass',
      name: CHECK_NAMES.buyerPhotos,
      summary: {
        en: 'Buyer photos match. Listing photos are original.',
        id: 'Foto pembeli cocok. Foto listing asli.',
      },
      evidence: [
        {
          kind: 'photoPair',
          listingCaption: LISTING_PHOTO,
          buyerCaption: { en: 'Buyer photo, 18 Sep', id: 'Foto pembeli, 18 Sep' },
        },
      ],
    },
    {
      section: 'reviews',
      severity: 'pass',
      name: CHECK_NAMES.safetyComplaints,
      summary: {
        en: '9 low-star reviews, mostly delivery. 2 about the product.',
        id: '9 ulasan bintang rendah, kebanyakan soal pengiriman. 2 soal produk.',
      },
      evidence: [
        {
          kind: 'complaints',
          rows: [
            { category: CAT.irritation, count: 1 },
            { category: CAT.texture, count: 1 },
            { category: CAT.seal, count: 0 },
            { category: CAT.wrongItem, count: 0 },
            { category: CAT.expired, count: 0 },
            { category: CAT.digestive, count: 0 },
          ],
          note: { en: 'Other 7: delivery time.', id: '7 lainnya: waktu kirim.' },
        },
      ],
    },
  ],
}
