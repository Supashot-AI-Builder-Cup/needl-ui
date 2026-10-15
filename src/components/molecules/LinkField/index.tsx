import { useId, type Ref } from 'react'
import { Button } from '../../atoms/Button'
import { useTypewriterPlaceholder } from './useTypewriterPlaceholder'
import './index.css'

interface LinkFieldProps {
  value: string
  label: string
  placeholderPrefix: string
  placeholderItems: string[]
  pasteLabel: string
  inputRef: Ref<HTMLInputElement>
  onChange: (value: string) => void
  onSubmit: () => void
  onPaste: () => void
}

export function LinkField({
  value,
  label,
  placeholderPrefix,
  placeholderItems,
  pasteLabel,
  inputRef,
  onChange,
  onSubmit,
  onPaste,
}: LinkFieldProps) {
  const id = useId()
  const placeholder = useTypewriterPlaceholder(placeholderPrefix, placeholderItems)

  return (
    <div className="field">
      <label htmlFor={id} className="sr">
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        type="url"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit()
        }}
      />
      <Button size="sm" onClick={onPaste}>
        {pasteLabel}
      </Button>
    </div>
  )
}
