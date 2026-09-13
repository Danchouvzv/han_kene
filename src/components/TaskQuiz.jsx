import { useMemo, useState } from 'react'
import { quiz } from '../data/quiz'
import { playCorrect, playWrong, playFinish } from '../audio'
import Result from './Result'

const LETTERS = ['А', 'Б', 'В', 'Г']

export default function TaskQuiz({ onComplete }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const q = quiz[i]
  const score = useMemo(() => answers.filter(Boolean).length, [answers])

  function pick(idx) {
    if (picked !== null) return
    setPicked(idx)
    const ok = idx === q.c
    setAnswers((a) => [...a, ok])
    if (ok) playCorrect()
    else playWrong()
  }

  function next() {
    if (i + 1 >= quiz.length) {
      setFinished(true)
      playFinish()
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
      <div className="quiz">
        <Result
          score={score}
          total={quiz.length}
          hint="Экспресс-тест аяқталды. Қателескен сұрақтарды теория бөлімінен қайта қарап шығуға болады."
        />
        <div className="quiz__review">
          {quiz.map((item, n) => (
            <span key={n} className={`chip ${answers[n] ? 'chip--ok' : 'chip--no'}`}>
              {n + 1} {answers[n] ? '✔' : '✘'}
            </span>
          ))}
        </div>
        <button type="button" className="btn btn--outline" onClick={restart}>
          Тестті қайта өту
        </button>
      </div>
    )
  }

  return (
    <div className="quiz">
      <div className="quiz__meter">
        <div className="quiz__meter-bar">
          <span style={{ width: `${(i / quiz.length) * 100}%` }} />
        </div>
        <span className="quiz__meter-label">
          Сұрақ {i + 1} / {quiz.length} · дұрыс: {score}
        </span>
      </div>

      <div className={`qcard qcard--${q.src}`}>
        <span className="qcard__src">{q.src === 'kahar' ? '«Қаһар»' : '«Барсакелмес»'}</span>
        <h2 className="qcard__q">{q.q}</h2>

        <ul className="qcard__opts">
          {q.a.map((opt, idx) => {
            let cls = ''
            if (picked !== null) {
              if (idx === q.c) cls = 'is-correct'
              else if (idx === picked) cls = 'is-wrong'
              else cls = 'is-dim'
            }
            return (
              <li key={idx}>
                <button type="button" className={`opt ${cls}`} onClick={() => pick(idx)} disabled={picked !== null}>
                  <span className="opt__letter">{LETTERS[idx]}</span>
                  <span className="opt__text">{opt}</span>
                  {picked !== null && idx === q.c && <span className="opt__mark">✔</span>}
                  {picked !== null && idx === picked && idx !== q.c && <span className="opt__mark">✘</span>}
                </button>
              </li>
            )
          })}
        </ul>

        {picked !== null && (
          <div className={`explain ${picked === q.c ? 'explain--ok' : 'explain--no'}`}>
            <b>{picked === q.c ? 'Дұрыс!' : 'Қате.'}</b> {q.e}
          </div>
        )}
      </div>

      {picked !== null && (
        <button type="button" className="btn btn--primary btn--wide" onClick={next}>
          {i + 1 === quiz.length ? 'Нәтижені көру' : 'Келесі сұрақ'} <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  )
}
