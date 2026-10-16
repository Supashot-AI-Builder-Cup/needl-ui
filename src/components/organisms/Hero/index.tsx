import { usePreferences } from '../../../context/preferences/usePreferences'
import { useMagnifierLens } from './useMagnifierLens'
import './index.css'

export function Hero() {
  const { t } = usePreferences()
  const { titleRef, lensRef, glassRef, cloneRef } = useMagnifierLens()

  // Rendered twice: once as the real heading, once zoomed inside the lens.
  const title = (
    <>
      <span className="h1a">{t('h1a')}</span>{' '}
      <span className="h1b">
        {t('h1bPre')}
        <span className="sus">{t('h1bMark')}</span>
      </span>
    </>
  )

  return (
    <section className="hero">
      <div className="hero-title">
        <h1 ref={titleRef}>{title}</h1>
        <p className="lede hero-lede">{t('lede')}</p>
        <div className="lens" ref={lensRef} aria-hidden="true">
          <div className="handle" />
          <div className="glass" ref={glassRef}>
            <div className="clone" ref={cloneRef}>
              {title}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
