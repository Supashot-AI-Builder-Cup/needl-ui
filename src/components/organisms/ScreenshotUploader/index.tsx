import { usePreferences } from '../../../context/preferences/usePreferences'
import type { TextKey } from '../../../i18n'
import { buttonClass } from '../../../lib/buttonClass'
import { Button } from '../../atoms/Button'
import { FileButton } from '../../atoms/FileButton'
import { Icon } from '../../atoms/Icon'
import { ScreenshotSlot } from '../../molecules/ScreenshotSlot'
import { useScreenshotUploads } from './useScreenshotUploads'
import './index.css'

interface ScreenshotUploaderProps {
  /** Sends the screenshots; resolves to an error text, or null when the check started. */
  onContinue: () => Promise<TextKey | null>
}

export function ScreenshotUploader({ onContinue }: ScreenshotUploaderProps) {
  const { t, pick } = usePreferences()
  const s = useScreenshotUploads(onContinue)
  return (
    <>
      <h2 style={{ marginTop: 10 }}>{t('shotsH')}</h2>
      <p className="muted" style={{ margin: '0 0 18px' }}>
        {t('shotsLede')}
      </p>
      <ul className="slots">
        {s.slots.map((slot) => (
          <ScreenshotSlot
            key={slot.key}
            image={s.uploads[slot.key]}
            title={pick(slot.title)}
            required={slot.required}
            hint={pick(slot.hint)}
            uses={pick(slot.uses)}
            onFile={(file) => s.setSlotFile(slot.key, file)}
            onDelete={() => s.clearSlot(slot.key)}
          />
        ))}
        {s.extras.map((extra) => (
          <ScreenshotSlot
            key={extra.id}
            image={extra.image}
            name={{
              value: extra.name,
              label: t('nameLabel'),
              autoFocus: extra.id === s.focusId,
              onChange: (name) => s.renameExtra(extra.id, name),
            }}
            hint={t('extraHint')}
            onFile={(file) => s.replaceExtra(extra.id, file)}
            onDelete={() => s.removeExtra(extra.id)}
          />
        ))}
      </ul>
      {s.canAddExtra ? (
        <FileButton className={buttonClass({}, 'addshot')} onFile={s.addExtra}>
          <Icon name="plus" strokeWidth={1.9} />
          {t('addShot')}
        </FileButton>
      ) : (
        <p className="muted small">{t('errTooManyExtras')}</p>
      )}
      {s.error && (
        <p className="error" role="alert">
          {t(s.error)}
        </p>
      )}
      <div className="field-actions">
        <Button variant="primary" block disabled={!s.canContinue} onClick={s.submit}>
          {s.submitting ? t('sending') : t('cont')}
        </Button>
      </div>
    </>
  )
}
