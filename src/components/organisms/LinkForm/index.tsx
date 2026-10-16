import { usePreferences } from '../../../context/preferences/usePreferences'
import type { TextKey } from '../../../i18n'
import { Button } from '../../atoms/Button'
import { LinkField } from '../../molecules/LinkField'
import { useLinkForm } from './useLinkForm'

interface LinkFormProps {
  /** Starts the check; resolves to an error text, or null when it started. */
  onSubmit: (link: string) => Promise<TextKey | null>
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
        <Button variant="primary" block disabled={form.submitting} onClick={form.submit}>
          {form.submitting ? t('sending') : t('find')}
        </Button>
      </div>
    </>
  )
}
