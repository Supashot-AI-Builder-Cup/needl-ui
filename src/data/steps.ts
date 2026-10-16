import type { Step } from '../types/domain'

/**
 * Lines of the checking log, in order. `progress` matches the job progress
 * the API reports when that step is done (see "Job progress" in API_Contract.md).
 */
export const STEPS: Step[] = [
  {
    key: 'radar',
    label: { en: 'Checking store name', id: 'Cek nama toko' },
    progress: 38,
    result: { kind: 'check', code: 'store-name' },
  },
  {
    key: 'jargon',
    label: { en: 'Scanning description', id: 'Pindai deskripsi' },
    progress: 46,
    result: { kind: 'check', code: 'risky-terms' },
  },
  {
    key: 'claims',
    label: { en: 'Checking BPOM and Halal', id: 'Cek BPOM dan Halal' },
    progress: 54,
    result: { kind: 'check', code: 'claims' },
  },
  {
    key: 'bots',
    label: { en: 'Checking review patterns', id: 'Cek pola ulasan' },
    progress: 62,
    result: { kind: 'check', code: 'fake-reviews' },
  },
  {
    key: 'photos',
    label: { en: 'Comparing buyer photos', id: 'Bandingkan foto pembeli' },
    progress: 70,
    result: { kind: 'check', code: 'buyer-photos' },
  },
  {
    key: 'digest',
    label: { en: 'Sorting low-star reviews', id: 'Kelompokkan ulasan rendah' },
    progress: 78,
    result: { kind: 'check', code: 'safety-complaints' },
  },
  {
    key: 'safer',
    label: { en: 'Finding safer stores', id: 'Cari toko lebih aman' },
    progress: 86,
    result: { kind: 'stores' },
  },
  {
    key: 'qs',
    label: { en: 'Writing seller questions', id: 'Susun pertanyaan' },
    progress: 94,
    result: { kind: 'questions' },
  },
]
