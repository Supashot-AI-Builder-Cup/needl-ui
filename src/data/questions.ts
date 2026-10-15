import type { LocalText } from '../i18n'

/** Questions worth asking any seller. */
export const BASE_QUESTIONS: LocalText[] = [
  { id: 'Kak, nomor BPOM di kemasannya berapa?', en: 'What’s the BPOM number on the packaging?' },
  {
    id: 'Kak, segelnya utuh dan ada stiker hologram di box?',
    en: 'Is the seal intact, with a hologram sticker on the box?',
  },
  {
    id: 'Kak, tanggal kedaluwarsa stok yang dikirim kapan?',
    en: 'What’s the expiry date on the stock you’ll send?',
  },
]

/** Extra questions triggered by flags on a risky listing. */
export const FLAG_QUESTIONS: LocalText[] = [
  {
    id: 'Kak, boleh minta foto barang aslinya dengan tanggal hari ini?',
    en: 'Can you send a photo of the actual item with today’s date?',
  },
  {
    id: 'Kak, ini repack dari botol besar? Aslinya dari mana?',
    en: 'Is this repacked from a bigger bottle? Where is it from?',
  },
]
