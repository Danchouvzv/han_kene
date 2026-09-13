// Қазақтың ою-өрнек мотивтері (қошқар мүйіз, тұмарша) — таза SVG

export function KoshkarMuiz({ className = '', style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 160 140" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {/* орталық сабақ */}
        <path d="M80 136 V64" />
        {/* сол мүйіз */}
        <path d="M80 66 C80 40 56 26 34 34 C14 41 10 66 28 76 C41 83 58 74 55 60 C53 50 41 47 35 55" />
        {/* оң мүйіз */}
        <path d="M80 66 C80 40 104 26 126 34 C146 41 150 66 132 76 C119 83 102 74 105 60 C107 50 119 47 125 55" />
        {/* жоғарғы тәж */}
        <path d="M80 64 V26" />
        <path d="M80 30 C68 30 60 22 62 10" />
        <path d="M80 30 C92 30 100 22 98 10" />
        {/* тұмарша */}
        <path d="M80 96 L92 110 L80 124 L68 110 Z" />
      </g>
    </svg>
  )
}

export function OrnamentCorners() {
  return (
    <div className="orn-corners" aria-hidden="true">
      <KoshkarMuiz className="orn orn--tl" />
      <KoshkarMuiz className="orn orn--tr" />
      <KoshkarMuiz className="orn orn--bl" />
      <KoshkarMuiz className="orn orn--br" />
    </div>
  )
}

export function OrnamentRule({ tone = 'ink' }) {
  return (
    <div className={`orn-rule orn-rule--${tone}`} aria-hidden="true">
      <span className="orn-rule__line" />
      <svg viewBox="0 0 80 34" className="orn-rule__mark">
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 31 V17" />
          <path d="M40 18 C40 9 28 4 19 8 C11 11 10 21 18 25 C24 28 31 24 30 18 C29 14 24 13 21 16" />
          <path d="M40 18 C40 9 52 4 61 8 C69 11 70 21 62 25 C56 28 49 24 50 18 C51 14 56 13 59 16" />
          <path d="M40 17 V6" />
          <path d="M34 8 L40 3 L46 8" />
        </g>
      </svg>
      <span className="orn-rule__line" />
    </div>
  )
}

export function Yurt({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 64 48" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M6 44 H58" />
        <path d="M10 44 V26 C10 14 20 6 32 6 C44 6 54 14 54 26 V44" />
        <path d="M32 6 V2" />
        <path d="M20 12 L32 26 L44 12" />
        <path d="M10 26 H54" />
      </g>
    </svg>
  )
}
