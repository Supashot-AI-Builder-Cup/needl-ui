import { useId } from 'react'
import { usePreferences } from '../../../context/preferences/usePreferences'
import { Icon } from '../../atoms/Icon'
import { useChecksOverview } from './useChecksOverview'
import './index.css'

/** Collapsible "What needl checks" list. */
export function ChecksOverview() {
  const { t, pick } = usePreferences()
  const { open, toggle, listRef, items } = useChecksOverview()
  const listId = useId()
  return (
    <div className="checks-list">
      <button type="button" className="cl-head" aria-expanded={open} aria-controls={listId} onClick={toggle}>
        <span>{t('whatChecks')}</span>
        <Icon name="chevronDown" className="schev" strokeWidth={1.9} />
      </button>
      <ul id={listId} ref={listRef} hidden={!open}>
        {items.map((item) => (
          <li key={item.icon}>
            <span className="ci">
              <Icon name={item.icon} />
            </span>
            <span>{pick(item.name)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
