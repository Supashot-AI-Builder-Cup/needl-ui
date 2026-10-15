import { BrandMark } from '../../atoms/BrandMark'
import { LanguageSwitch } from '../../molecules/LanguageSwitch'
import { ThemeToggle } from '../../molecules/ThemeToggle'
import { useHeader } from './useHeader'
import './Header.css'

export function Header() {
  const h = useHeader()
  return (
    <header className="top">
      <BrandMark label={h.homeLabel} onClick={h.goHome} />
      <div className="tools">
        <ThemeToggle label={h.themeLabel} onToggle={h.toggleTheme} />
        <LanguageSwitch value={h.lang} label={h.languageLabel} onChange={h.setLang} />
      </div>
    </header>
  )
}
