import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DICTIONARIES, isLang, pick, type Lang, type LocalText, type TextKey } from '../../i18n'
import { readStorage, STORAGE_KEYS, writeStorage } from '../../lib/storage'
import { PreferencesContext, type Theme } from './PreferencesContext'

// index.html applies the saved theme before React loads (no flash), so read it back from <html>.
function initialTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

function initialLang(): Lang {
  const saved = readStorage(STORAGE_KEYS.lang)
  return isLang(saved) ? saved : 'en'
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    writeStorage(STORAGE_KEYS.theme, next)
  }, [theme])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    writeStorage(STORAGE_KEYS.lang, next)
  }, [])

  const value = useMemo(() => {
    const dict = DICTIONARIES[lang]
    return {
      theme,
      lang,
      dict,
      toggleTheme,
      setLang,
      t: (key: TextKey) => dict[key],
      pick: (text: LocalText) => pick(text, lang),
    }
  }, [theme, lang, toggleTheme, setLang])

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}
