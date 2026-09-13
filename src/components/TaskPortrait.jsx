import { useMemo, useState } from 'react'
import { cards } from '../data/portrait'
import { playCorrect, playWrong, playFinish, playClick } from '../audio'
import newKeneImg from '../assets/new-kenesary.jpg'
import Result from './Result'

function shuffle(arr, seed = 11) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TARGET = 6

export default function TaskPortrait({ onComplete }) {
  const deck = useMemo(() => shuffle(cards, 2026), [])
  const [picked, setPicked] = useState([])
  const [checked, setChecked] = useState(false)
  const [dragId, setDragId] = useState(null)

  const inBasket = (id) => picked.includes(id)

  function toggle(id) {
    if (checked) return
    playClick()
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= TARGET ? p : [...p, id]))
  }

  function drop(e) {
    e.preventDefault()
    if (checked || !dragId) return
    if (!picked.includes(dragId) && picked.length < TARGET) {
      setPicked((p) => [...p, dragId])
      playClick()
    }
    setDragId(null)
  }

  const score = picked.filter((id) => cards.find((c) => c.id === id)?.src === 'barsa').length

  function check() {
    setChecked(true)
    if (score === TARGET) playFinish()
    else if (score >= 4) playCorrect()
    else playWrong()
    onComplete()
  }

  function reset() {
    setPicked([])
    setChecked(false)
  }

  return (
    <div className="portrait">
      <div className="portrait__center">
        <div className="portrait__figure">
          <img src={newKeneImg} alt="Жаңа Кенесары — заманауи реконструкцияланған бейне" />
          <div className="portrait__cap">
            <span>Жаңа Кенесары</span>
            <small>«Барсакелмес» бойынша реконструкцияланған бейне</small>
          </div>
        </div>

        <div
          className={`basket ${picked.length === TARGET ? 'is-full' : ''} ${dragId ? 'is-hot' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={drop}
        >
          <div className="basket__head">
            Портрет қоржыны <b>{picked.length} / {TARGET}</b>
          </div>
          <div className="basket__slots">
            {Array.from({ length: TARGET }).map((_, n) => {
              const id = picked[n]
              const card = id ? cards.find((c) => c.id === id) : null
              const ok = checked && card && card.src === 'barsa'
              const bad = checked && card && card.src !== 'barsa'
              return (
                <div key={n} className={`slot ${card ? 'is-filled' : ''} ${ok ? 'is-ok' : ''} ${bad ? 'is-bad' : ''}`}>
                  {card ? (
                    <button type="button" onClick={() => toggle(card.id)} disabled={checked}>
                      <span className="slot__tag">{card.tag}</span>
                      {checked && <span className="slot__mark">{ok ? '✔' : '✘'}</span>}
                    </button>
                  ) : (
                    <span className="slot__empty">{n + 1}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <p className="hint">
        12 деректің ішінен тек <b>«Барсакелмес»</b> шығармасына тиесілі 6-ын таңдаңыз немесе қоржынға
        сүйреп апарыңыз. «Қаһар» деректері — жаңылдыратын нұсқалар.
      </p>

      <div className="deck">
        {deck.map((c) => {
          const sel = inBasket(c.id)
          const ok = checked && sel && c.src === 'barsa'
          const bad = checked && sel && c.src !== 'barsa'
          const missed = checked && !sel && c.src === 'barsa'
          return (
            <button
              key={c.id}
              type="button"
              draggable={!checked}
              onDragStart={() => setDragId(c.id)}
              onDragEnd={() => setDragId(null)}
              onClick={() => toggle(c.id)}
              disabled={checked}
              className={`dcard ${sel ? 'is-sel' : ''} ${ok ? 'is-ok' : ''} ${bad ? 'is-bad' : ''} ${missed ? 'is-missed' : ''} ${checked ? `is-${c.src}` : ''}`}
            >
              <span className="dcard__tag">{c.tag}</span>
              <span className="dcard__text">{c.text}</span>
              {checked && (
                <span className="dcard__src">{c.src === 'barsa' ? '«Барсакелмес»' : '«Қаһар»'}</span>
              )}
            </button>
          )
        })}
      </div>

      {!checked ? (
        <button
          type="button"
          className="btn btn--primary btn--wide"
          onClick={check}
          disabled={picked.length < TARGET}
        >
          {picked.length < TARGET ? `Тағы ${TARGET - picked.length} дерек таңдаңыз` : 'Портретті тексеру'}
        </button>
      ) : (
        <>
          <Result
            score={score}
            total={TARGET}
            hint="«Барсакелмес» деректерінде әрқашан заманауи белгі бар: «Аттила», лаборатория, 1001 кітап, арқан, Батыс саясаткерлері."
          />
          <button type="button" className="btn btn--outline" onClick={reset}>
            Қайта орындау
          </button>
        </>
      )}
    </div>
  )
}
