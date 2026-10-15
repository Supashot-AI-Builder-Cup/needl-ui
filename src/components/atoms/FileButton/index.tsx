import type { ReactNode } from 'react'

interface FileButtonProps {
  className: string
  onFile: (file: File) => void
  children: ReactNode
}

/** A label styled as a button that opens the image picker. */
export function FileButton({ className, onFile, children }: FileButtonProps) {
  return (
    <label className={className}>
      {children}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          // Reset so picking the same file again still fires change.
          e.target.value = ''
          if (file) onFile(file)
        }}
      />
    </label>
  )
}
