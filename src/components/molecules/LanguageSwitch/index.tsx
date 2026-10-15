import { LANGS, type Lang } from '../../../i18n'
import './index.css'

interface LanguageSwitchProps {
  value: Lang
  label: string
  onChange: (lang: Lang) => void
}

export function LanguageSwitch({ value, label, onChange }: LanguageSwitchProps) {
  return (
    <div className="lang" role="group" aria-label={label}>
      {LANGS.map((lang) => (
        <button key={lang} type="button" aria-pressed={lang === value} onClick={() => onChange(lang)}>
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
