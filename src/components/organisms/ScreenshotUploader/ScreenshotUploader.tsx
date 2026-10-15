import { usePreferences } from '../../../context/preferences/usePreferences'
import { Button, buttonClass } from '../../atoms/Button'
import { FileButton } from '../../atoms/FileButton'
import { Icon } from '../../atoms/Icon'
import { ScreenshotSlot } from '../../molecules/ScreenshotSlot'
import { useScreenshotUploads } from './useScreenshotUploads'
import './ScreenshotUploader.css'

interface ScreenshotUploaderProps {
  onContinue: () => void
}

export function ScreenshotUploader({ onContinue }: ScreenshotUploaderProps) {
  const { t, pick } = usePreferences()
  const s = useScreenshotUploads()
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
      <FileButton className={buttonClass({}, 'addshot')} onFile={s.addExtra}>
        <Icon name="plus" strokeWidth={1.9} />
        {t('addShot')}
      </FileButton>
      <div className="field-actions">
        <Button variant="primary" block disabled={!s.canContinue} onClick={onContinue}>
          {t('cont')}
        </Button>
      </div>
    </>
  )
}
