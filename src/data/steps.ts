import type { Step } from '../types/domain'

/** Steps shown in the checking log, in order. */
export const STEPS: Step[] = [
  {
    key: 'radar',
    label: { en: 'Checking store name', id: 'Cek nama toko' },
    result: {
      risky: { en: '2 letters swapped', id: '2 huruf ditukar' },
      safe: { en: 'Matches official store', id: 'Cocok dengan toko resmi' },
    },
    severity: { risky: 'critical', safe: 'pass' },
  },
  {
    key: 'jargon',
    label: { en: 'Scanning description', id: 'Pindai deskripsi' },
    result: {
      risky: { en: '3 risky terms', id: '3 istilah berisiko' },
      safe: { en: 'None found', id: 'Tidak ada' },
    },
    severity: { risky: 'critical', safe: 'pass' },
  },
  {
    key: 'claims',
    label: { en: 'Checking BPOM and Halal', id: 'Cek BPOM dan Halal' },
    result: {
      risky: { en: '2 unverified', id: '2 tak terverifikasi' },
      safe: { en: 'Both verified', id: 'Keduanya terverifikasi' },
    },
    severity: { risky: 'major', safe: 'minor' },
  },
  {
    key: 'bots',
    label: { en: 'Checking review patterns', id: 'Cek pola ulasan' },
    result: {
      risky: { en: '64 reviews in 36 hours', id: '64 ulasan dalam 36 jam' },
      safe: { en: 'Normal pattern', id: 'Pola wajar' },
    },
    severity: { risky: 'critical', safe: 'pass' },
  },
  {
    key: 'photos',
    label: { en: 'Comparing buyer photos', id: 'Bandingkan foto pembeli' },
    result: {
      risky: { en: '7 don’t match', id: '7 tidak cocok' },
      safe: { en: 'All match', id: 'Semua cocok' },
    },
    severity: { risky: 'major', safe: 'pass' },
  },
  {
    key: 'digest',
    label: { en: 'Sorting low-star reviews', id: 'Kelompokkan ulasan rendah' },
    result: {
      risky: { en: '38 complaints', id: '38 keluhan' },
      safe: { en: '9 complaints', id: '9 keluhan' },
    },
    severity: { risky: 'major', safe: 'pass' },
  },
  {
    key: 'safer',
    label: { en: 'Finding safer stores', id: 'Cari toko lebih aman' },
    result: {
      risky: { en: '3 found', id: '3 ditemukan' },
      safe: { en: 'Already official', id: 'Sudah toko resmi' },
    },
    severity: { risky: 'pass', safe: 'pass' },
  },
  {
    key: 'qs',
    label: { en: 'Writing seller questions', id: 'Susun pertanyaan' },
    result: {
      risky: { en: '5 ready', id: '5 siap' },
      safe: { en: '3 ready', id: '3 siap' },
    },
    severity: { risky: 'pass', safe: 'pass' },
  },
]
