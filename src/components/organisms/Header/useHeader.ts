import { useNavigate } from 'react-router'
import { usePreferences } from '../../../context/preferences/usePreferences'

export function useHeader() {
  const { theme, toggleTheme, lang, setLang, t } = usePreferences()
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
    window.scrollTo(0, 0)
  }

  return {
    lang,
    setLang,
    toggleTheme,
    goHome,
    themeLabel: theme === 'dark' ? t('themeToLight') : t('themeToDark'),
    homeLabel: t('homeLabel'),
    languageLabel: t('language'),
  }
}
