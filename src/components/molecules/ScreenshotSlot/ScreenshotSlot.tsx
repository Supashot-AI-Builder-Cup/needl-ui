import { usePreferences } from '../../../context/preferences/usePreferences'
import { cx } from '../../../lib/cx'
import { Button, buttonClass } from '../../atoms/Button'
import { FileButton } from '../../atoms/FileButton'
import { Icon } from '../../atoms/Icon'
import './ScreenshotSlot.css'

interface EditableName {
  value: string
  label: string
  /** Focus and select the name right after the slot is added. */
  autoFocus?: boolean
  onChange: (value: string) => void
}

interface ScreenshotSlotProps {
  image?: string
  /** Fixed slot title. Ignored when `name` is given. */
  title?: string
  required?: boolean
  /** Editable name, used for extra screenshots. */
  name?: EditableName
  hint: string
  uses?: string
  onFile: (file: File) => void
  onDelete: () => void
}

export function ScreenshotSlot({ image, title, required, name, hint, uses, onFile, onDelete }: ScreenshotSlotProps) {
  const { t } = usePreferences()
  return (
    <li className="slot">
      <div className={cx('thumb', image && 'filled')}>
        {image ? (
          <img src={image} alt="" />
        ) : (
          <Icon name="phone" strokeWidth={1.6} width={18} height={18} style={{ color: 'var(--ink-2)' }} />
        )}
      </div>
      <div className="txt">
        {name ? (
          <input
            className="slot-name"
            value={name.value}
            aria-label={name.label}
            maxLength={40}
            autoFocus={name.autoFocus}
            onFocus={name.autoFocus ? (e) => e.currentTarget.select() : undefined}
            onChange={(e) => name.onChange(e.target.value)}
          />
        ) : (
          <strong>
            {title}
            {required && (
              <span className="req" aria-label={t('required')} title={t('required')}>
                *
              </span>
            )}
          </strong>
        )}
        <div className="hint">{hint}</div>
        {uses && (
          <div className="uses">
            {t('usedFor')}: {uses}
          </div>
        )}
      </div>
      <div className="slot-acts">
        {image && (
          <Button size="sm" className="slot-del" aria-label={t('del')} title={t('del')} onClick={onDelete}>
            <Icon name="trash" strokeWidth={1.8} />
          </Button>
        )}
        <FileButton className={buttonClass({ size: 'sm' })} onFile={onFile}>
          {image ? t('replace') : t('add')}
        </FileButton>
      </div>
    </li>
  )
}
