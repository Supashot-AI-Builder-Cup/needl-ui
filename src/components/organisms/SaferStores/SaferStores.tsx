import { usePreferences } from '../../../context/preferences/usePreferences'
import type { Store } from '../../../types/domain'
import { SectionCard } from '../../molecules/SectionCard'
import { StoreRow } from '../../molecules/StoreRow'

/** Safer places to buy; empty when the listing is already the official store. */
export function SaferStores({ stores }: { stores: Store[] }) {
  const { t } = usePreferences()
  return (
    <SectionCard isStatic title={t('secSafer')} lede={stores.length ? t('saferLedeRisky') : t('saferLedeSafe')}>
      {stores.map((store) => (
        <StoreRow key={store.name} store={store} />
      ))}
    </SectionCard>
  )
}
