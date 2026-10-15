import { Icon } from '../../atoms/Icon'
import './Disclaimer.css'

export function Disclaimer({ text }: { text: string }) {
  return (
    <p className="disc">
      <Icon name="warning" strokeWidth={1.8} />
      <span>{text}</span>
    </p>
  )
}
