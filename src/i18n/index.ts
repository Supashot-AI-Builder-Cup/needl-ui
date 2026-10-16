import { en, type Dictionary } from './en'
import { id } from './id'

export type { Dictionary }

export type Lang = 'en' | 'id'

/** Plain string (same in every language) or one string per language. */
export type LocalText = string | Record<Lang, string>

/** Dictionary keys whose value is a single string. */
export type TextKey = {
  [K in keyof Dictionary]: Dictionary[K] extends string ? K : never
}[keyof Dictionary]

export const LANGS: Lang[] = ['en', 'id']

export const DICTIONARIES: Record<Lang, Dictionary> = { en, id }

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'id'
}

export function pick(text: LocalText, lang: Lang): string {
  return typeof text === 'string' ? text : (text[lang] ?? text.en)
}

/** Fill `{name}` placeholders: format('{n} found', { n: 3 }). */
export function format(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}
