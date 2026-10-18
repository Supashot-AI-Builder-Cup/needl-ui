import { usePreferences } from '../../../context/preferences/usePreferences'
import type { Store } from '../../../types/domain'
import { SectionCard } from '../../molecules/SectionCard'
import { StoreRow } from '../../molecules/StoreRow'

/** Safer places to buy; empty when the listing is already the official store. */
interface SaferStoresProps {
  stores: Store[]
  /** The checked listing is itself an official Mall store. */
  official: boolean
}

export function SaferStores({ stores, official }: SaferStoresProps) {
  const { t } = usePreferences()
  const lede = stores.length ? t('saferLedeRisky') : official ? t('saferLedeSafe') : t('saferLedeNone')
  return (
    <SectionCard isStatic title={t('secSafer')} lede={lede}>
      {stores.map((store) => (
        <StoreRow key={store.name} store={store} />
      ))}
    </SectionCard>
  )
}
