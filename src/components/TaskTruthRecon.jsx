import { useState } from 'react'
import { statements } from '../data/factrecon'
import { playCorrect, playWrong, playFinish } from '../audio'
import Result from './Result'

// Шындық пен көркемдік реконструкция: берілген сөйлемнің тарихи дерек пе,
// әлде авторлық көркем реконструкциялау ма екенін анықтау.
export default function TaskTruthRecon({ onComplete }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const s = statements[i]
  const score = answers.filter(Boolean).length

  function pick(isFact) {
    if (picked !== null) return
    setPicked(isFact)
    const ok = isFact === s.fact
    setAnswers((a) => [...a, ok])
    ok ? playCorrect() : playWrong()
  }

  function next() {
    if (i + 1 >= statements.length) {
      playFinish()
      setFinished(true)
      onComplete()
    } else {
      setI(i + 1)
      setPicked(null)
    }
  }

  function restart() {
    setI(0)
    setPicked(null)
    setAnswers([])
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="parta">
        <Result
          score={score}
          total={statements.length}
          hint="Тарихи дерек — құжатпен расталған факт; көркем реконструкция — жазушының қиялы мен интерпретациясы."
        />
        <div className="quiz__review">
          {statements.map((_, n) => (
            <span key={n} className={`chip ${answers[n] ? 'chip--ok' : 'chip--no'}`}>
              {n + 1} {answers[n] ? '✔' : '✘'}
            </span>
          ))}
        </div>
        <button type="button" className="btn btn--outline" onClick={restart}>
          Қайта орындау
        </button>
      </div>
    )
  }

  return (
    <div className="parta">
      <div className="quiz__meter">
        <div className="quiz__meter-bar">
          <span style={{ width: `${(i / statements.length) * 100}%` }} />
        </div>
        <span className="quiz__meter-label">
          Сөйлем {i + 1} / {statements.length} · дұрыс: {score}
        </span>
      </div>

      <blockquote className="stmt">{s.t}</blockquote>

      <div className="stmt__btns">
        <button
          type="button"
          className={`bigbtn bigbtn--fact ${picked !== null ? (s.fact ? 'is-correct' : picked === true ? 'is-wrong' : 'is-dim') : ''}`}
          onClick={() => pick(true)}
          disabled={picked !== null}
        >
          Тарихи дерек
        </button>
        <button
          type="button"
          className={`bigbtn bigbtn--recon ${picked !== null ? (!s.fact ? 'is-correct' : picked === false ? 'is-wrong' : 'is-dim') : ''}`}
          onClick={() => pick(false)}
          disabled={picked !== null}
        >
          Көркем реконструкциялау
        </button>
      </div>

      {picked !== null && (
        <div className={`explain ${picked === s.fact ? 'explain--ok' : 'explain--no'}`}>
          <b>{picked === s.fact ? 'Дұрыс!' : 'Қате.'}</b> {s.e}
        </div>
      )}

      {picked !== null && (
        <button type="button" className="btn btn--primary btn--wide" onClick={next}>
          {i + 1 === statements.length ? 'Нәтижені көру' : 'Келесі сөйлем'} <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  )
}
