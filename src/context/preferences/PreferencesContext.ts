import { createContext } from 'react'
import type { Dictionary, Lang, LocalText, TextKey } from '../../i18n'

export type Theme = 'light' | 'dark'

export interface PreferencesValue {
  theme: Theme
  lang: Lang
  dict: Dictionary
  toggleTheme: () => void
  setLang: (lang: Lang) => void
  /** Translate a dictionary key. */
  t: (key: TextKey) => string
  /** Resolve inline `{ en, id }` text from data files. */
  pick: (text: LocalText) => string
}

export const PreferencesContext = createContext<PreferencesValue | null>(null)
