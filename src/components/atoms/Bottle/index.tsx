import { useId } from 'react'
import type { BottleVariant } from '../../../types/domain'
import './index.css'

/** Serum bottle illustration used as the product photo. */
export function Bottle({ dropper = '#F5F2EC', holo = true, thin = false }: BottleVariant) {
  // useId output can contain characters that break url(#id), so keep it simple.
  const gradientId = 'h' + useId().replace(/[^\w-]/g, '')
  const weight = thin ? 400 : 600

  return (
    <svg className="bottle" viewBox="0 0 120 200" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7FE0D2" />
          <stop offset=".35" stopColor="#C8A6F2" />
          <stop offset=".7" stopColor="#F6D27A" />
          <stop offset="1" stopColor="#8FD3F4" />
        </linearGradient>
      </defs>
      <rect x="47" y="6" width="26" height="36" rx="13" fill={dropper} stroke="rgba(0,0,0,.15)" />
      <rect x="41" y="38" width="38" height="18" rx="3" fill="#C7A566" />
      <rect x="41" y="44" width="38" height="2" fill="rgba(0,0,0,.12)" />
      <path d="M28 72 Q28 56 44 56 H76 Q92 56 92 72 V178 Q92 192 78 192 H42 Q28 192 28 178 Z" fill="#9B5A20" />
      <path d="M34 70 Q34 62 42 62 V184 Q34 182 34 174 Z" fill="#fff" opacity=".18" />
      <rect x="36" y="94" width="48" height="68" rx="4" fill="#F7F3EA" />
      <text x="60" y="111" textAnchor="middle" fontFamily="Newsreader,Georgia,serif" fontSize="10" fontWeight={weight} fill="#16322A">
        Dermalune
      </text>
      <text x="60" y="132" textAnchor="middle" fontFamily="Geist,Arial,sans-serif" fontSize="15" fontWeight={weight} fill="#16322A">
        10%
      </text>
      <text x="60" y="143" textAnchor="middle" fontFamily="Geist,Arial,sans-serif" fontSize="6.5" fill="#16322A">
        Niacinamide
      </text>
      <text x={holo ? 52 : 60} y="155" textAnchor="middle" fontFamily="Geist,Arial,sans-serif" fontSize="5.5" fill="#4F635C">
        30 ml
      </text>
      {holo && <circle cx="74" cy="153" r="5.5" fill={`url(#${gradientId})`} />}
    </svg>
  )
}
