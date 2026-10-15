import { diffChars } from '../../../../lib/nameDiff'
import './NameCompare.css'

interface NameCompareProps {
  official: string
  store: string
  officialLabel: string
  storeLabel: string
}

const NBSP = ' '
const keepSpaces = (s: string) => s.replace(/ /g, NBSP)

/** Official store name above this store's name, with differing letters highlighted. */
export function NameCompare({ official, store, officialLabel, storeLabel }: NameCompareProps) {
  return (
    <div className="namecmp">
      {keepSpaces(official)}
      <span className="lbl">{officialLabel}</span>
      {diffChars(official, store).map(({ char, changed }, i) => {
        const shown = keepSpaces(char)
        return changed ? <mark key={i}>{shown}</mark> : shown
      })}
      <span className="lbl">{storeLabel}</span>
    </div>
  )
}
