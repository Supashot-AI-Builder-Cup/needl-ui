import './index.css'

export function Stars({ count }: { count: number }) {
  return <span className="stars">{'★'.repeat(count)}</span>
}
