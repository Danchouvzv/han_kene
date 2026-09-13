import { useMemo, useState } from 'react'
import { excerpts, definitions, terms } from '../data/terms'
import { playCorrect, playWrong, playFinish, playClick } from '../audio'
import Result from './Result'

export default function TaskTerms({ onComplete }) {
  const [choice, setChoice] = useState({})
  const [checked, setChecked] = useState(false)
  const [openIdx, setOpenIdx] = useState(0)

  const shuffled = useMemo(() => definitions, [])
  const answered = Object.values(choice).filter(Boolean).length
  const score = useMemo(
    () => terms.filter((t) => choice[t.term] === t.answer).length,
    [choice]
  )

  function set(term, val) {
    if (checked) return
    playClick()
    setChoice((c) => ({ ...c, [term]: val }))
  }

  function check() {
    setChecked(true)
    const s = terms.filter((t) => choice[t.term] === t.answer).length
    if (s === terms.length) {
      playFinish()
    } else if (s >= terms.length / 2) {
      playCorrect()
    } else {
      playWrong()
    }
    onComplete()
  }

  function reset() {
    setChoice({})
    setChecked(false)
  }

  return (
    <div className="terms">
      <section className="terms__excerpts">
        <h2 className="sec-h">1-қадам. Үзінділерді оқыңыз</h2>
        <div className="exc-tabs">
          {excerpts.map((e, n) => (
            <button
              key={n}
              type="button"
              className={`exc-tab exc-tab--${e.src} ${openIdx === n ? 'is-active' : ''}`}
              onClick={() => { setOpenIdx(n); playClick() }}
            >
              {e.label}
            </button>
          ))}
        </div>
        <div className={`exc exc--${excerpts[openIdx].src}`}>
          <p>{excerpts[openIdx].text}</p>
        </div>
      </section>

      <section className="terms__match">
        <h2 className="sec-h">2-қадам. Терминді анықтамасымен сәйкестендіріңіз</h2>
        <div className="terms__list">
          {terms.map((t, n) => {
            const val = choice[t.term] || ''
            const ok = checked && val === t.answer
            const bad = checked && val !== t.answer
            return (
              <div key={t.term} className={`trow ${ok ? 'is-ok' : ''} ${bad ? 'is-bad' : ''}`}>
                <div className={`trow__term trow__term--${t.src}`}>
                  <span className="trow__n">{n + 1}</span>
                  {t.term}
                </div>
                <div className="trow__sel">
                  <select value={val} onChange={(e) => set(t.term, e.target.value)} disabled={checked}>
                    <option value="">— анықтамасын таңдаңыз —</option>
                    {shuffled.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.id}) {d.text}
                      </option>
                    ))}
                  </select>
                  {checked && (
                    <span className={`trow__mark ${ok ? 'ok' : 'no'}`}>{ok ? '✔' : '✘'}</span>
                  )}
                </div>
                {bad && (
                  <div className="trow__fix">
                    Дұрысы: <b>{t.answer})</b> {definitions.find((d) => d.id === t.answer).text}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!checked ? (
          <button
            type="button"
            className="btn btn--primary btn--wide"
            onClick={check}
            disabled={answered < terms.length}
          >
            {answered < terms.length
              ? `Барлығын таңдаңыз (${answered}/${terms.length})`
              : 'Сәйкестікті тексеру'}
          </button>
        ) : (
          <>
            <Result
              score={score}
              total={terms.length}
              hint="Термин мағынасын мәтін контексінен іздеңіз — үзінділерде әр сөздің қолданылу орны берілген."
            />
            <button type="button" className="btn btn--outline" onClick={reset}>
              Қайта орындау
            </button>
          </>
        )}
      </section>
    </div>
  )
}
