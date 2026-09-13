import { PINS } from '../data/kzmap'
import mapImg from '../assets/kazakhstan-3d.webp'

export default function KazakhstanMap({ tasks, done, onOpen, hovered, setHovered }) {
  return (
    <div className="map">
      <div className="map__paper">
        <img className="map__art" src={mapImg} alt="Қазақстанның 3D жерсерік картасы" draggable="false" />

        {tasks.map((t) => {
          const p = PINS[t.key]
          const isDone = !!done[t.key]
          const isHot = hovered === t.key
          return (
            <button
              key={t.key}
              type="button"
              className={`pin pin--${p.side} ${isDone ? 'pin--done' : 'pin--locked'} ${isHot ? 'is-hot' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => onOpen(t.key)}
              onMouseEnter={() => setHovered(t.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(t.key)}
              onBlur={() => setHovered(null)}
              aria-label={`${t.n}-тапсырма: ${t.title}`}
            >
              <span className="pin__pulse" aria-hidden="true" />
              <span className="pin__head">
                {isDone ? (
                  <svg viewBox="0 0 24 24" className="pin__check" aria-hidden="true">
                    <path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="pin__num">{t.n}</span>
                )}
              </span>
              <span className="pin__stem" aria-hidden="true" />
              <span className="pin__label">
                <span className="pin__label-title">{t.title}</span>
                <span className="pin__label-place">{p.place}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
