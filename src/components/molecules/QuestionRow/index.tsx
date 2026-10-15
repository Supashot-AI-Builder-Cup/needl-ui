import { Button } from '../../atoms/Button'
import './index.css'

interface QuestionRowProps {
  text: string
  copyLabel: string
  onCopy: () => void
}

/** Numbered question (number comes from a CSS counter) with a copy button. */
export function QuestionRow({ text, copyLabel, onCopy }: QuestionRowProps) {
  return (
    <li className="q">
      <div>
        <div className="qt">{text}</div>
      </div>
      <Button size="sm" onClick={onCopy}>
        {copyLabel}
      </Button>
    </li>
  )
}
