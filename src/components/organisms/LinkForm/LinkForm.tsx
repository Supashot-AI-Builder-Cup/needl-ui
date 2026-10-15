import { usePreferences } from '../../../context/preferences/usePreferences'
import type { ValidLink } from '../../../lib/parseLink'
import { Button } from '../../atoms/Button'
import { LinkField } from '../../molecules/LinkField'
import { useLinkForm } from './useLinkForm'
import './LinkForm.css'

interface LinkFormProps {
  onSubmit: (link: ValidLink) => void
}

export function LinkForm({ onSubmit }: LinkFormProps) {
  const { t, dict } = usePreferences()
  const form = useLinkForm(onSubmit)
  return (
    <>
      <LinkField
        value={form.value}
        label={t('placeholder')}
        placeholderPrefix={t('typePre')}
        placeholderItems={dict.typeItems}
        pasteLabel={t('paste')}
        inputRef={form.inputRef}
        onChange={form.setValue}
        onSubmit={form.submit}
        onPaste={form.paste}
      />
      {form.error && (
        <p className="error" role="alert">
          {t(form.error)}
        </p>
      )}
      <div className="field-actions">
        <Button variant="primary" block onClick={form.submit}>
          {t('find')}
        </Button>
      </div>
    </>
  )
}
