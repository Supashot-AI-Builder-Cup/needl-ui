import type { ReactNode } from 'react'
import type { StoreLogoName } from '../../../types/domain'
import './StoreLogo.css'

const LOGOS: Record<StoreLogoName, ReactNode> = {
  dermalune: (
    <>
      <rect width="52" height="52" fill="#F4EFE7" />
      <text x="25" y="36" textAnchor="middle" fontFamily="Newsreader,Georgia,serif" fontStyle="italic" fontSize="30" fill="#3A2A1C">
        D
      </text>
      <path d="M38 11c2.6 3 3.8 5 3.8 6.6a3.8 3.8 0 0 1-7.6 0c0-1.6 1.2-3.6 3.8-6.6z" fill="#9B5A20" />
    </>
  ),
  glowmart: (
    <>
      <rect width="52" height="52" fill="#1E3A2B" />
      <text x="24" y="35" textAnchor="middle" fontFamily="Geist,Arial,sans-serif" fontWeight="700" fontSize="24" fill="#CFEFDB">
        G
      </text>
      <path d="M38 10l1.4 3.6L43 15l-3.6 1.4L38 20l-1.4-3.6L33 15l3.6-1.4z" fill="#8FE0B0" />
    </>
  ),
  kulitku: (
    <>
      <rect width="52" height="52" fill="#F2E2E5" />
      <text x="23" y="35" textAnchor="middle" fontFamily="Geist,Arial,sans-serif" fontWeight="600" fontSize="24" fill="#8A3A4E">
        K
      </text>
      <path d="M35 20c0-5 3.5-8.5 9-9-0.4 5.6-3.9 9-9 9z" fill="#C46A80" />
      <path d="M35 20l5-5" stroke="#F2E2E5" strokeWidth="1.2" />
    </>
  ),
}

export function StoreLogo({ name }: { name: StoreLogoName }) {
  return (
    <div className="slogo">
      <svg viewBox="0 0 52 52" aria-hidden="true">
        {LOGOS[name]}
      </svg>
    </div>
  )
}
