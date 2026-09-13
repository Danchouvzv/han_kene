import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { statements, pairs } from '../data/factrecon'
import { playCorrect, playWrong, playFinish, playClick } from '../audio'
import Result from './Result'

/* ---------------- А-бөлім: дерек пе, реконструкция ма? ---------------- */

function PartA({ onDone }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [answers, setAnswers] = useState([])
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
      onDone(score)
    } else {
      setI(i + 1)
      setPicked(null)
    }
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
          {i + 1 === statements.length ? 'Б-бөлімге өту' : 'Келесі сөйлем'} <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  )
}

/* ---------------- Б-бөлім: сызықпен сәйкестендіру ---------------- */

function shuffle(arr, seed = 7) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function PartB({ onDone }) {
  const rights = useMemo(() => shuffle(pairs, 2), [])
  const [links, setLinks] = useState([])
  const [sel, setSel] = useState(null)
  // ref — жылдам қатарынан басқанда күй ескіріп қалмауы үшін
  const selRef = useRef(null)
  const [checked, setChecked] = useState(false)
  const [geo, setGeo] = useState([])

  const wrapRef = useRef(null)
  const leftRefs = useRef({})
  const rightRefs = useRef({})

  const measure = useCallback(() => {
    const w = wrapRef.current
    if (!w) return
    const wb = w.getBoundingClientRect()
    const next = links
      .map((l) => {
        const a = leftRefs.current[l.left]
        const b = rightRefs.current[l.right]
        if (!a || !b) return null
        const ra = a.getBoundingClientRect()
        const rb = b.getBoundingClientRect()
        return {
          key: `${l.left}-${l.right}`,
          x1: ra.right - wb.left,
          y1: ra.top + ra.height / 2 - wb.top,
          x2: rb.left - wb.left,
          y2: rb.top + rb.height / 2 - wb.top,
          ok: l.left === l.right,
        }
      })
      .filter(Boolean)
    setGeo(next)
  }, [links])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const onR = () => measure()
    window.addEventListener('resize', onR)
    window.addEventListener('scroll', onR, true)
    const t = setTimeout(onR, 250)
    return () => {
      window.removeEventListener('resize', onR)
      window.removeEventListener('scroll', onR, true)
      clearTimeout(t)
    }
  }, [measure])

  function clickLeft(id) {
    if (checked) return
    playClick()
    const next = selRef.current === id ? null : id
    selRef.current = next
    setSel(next)
  }

  function clickRight(id) {
    const left = selRef.current
    if (checked || left === null) return
    setLinks((ls) => [...ls.filter((l) => l.left !== left && l.right !== id), { left, right: id }])
    selRef.current = null
    setSel(null)
    playClick()
  }

  function clear() {
    setLinks([])
    selRef.current = null
    setSel(null)
    setChecked(false)
  }

  function check() {
    setChecked(true)
    const right = links.filter((l) => l.left === l.right).length
    if (right === pairs.length) playFinish()
    else if (right > 0) playCorrect()
    else playWrong()
    onDone(right)
  }

  const linkOf = (side, id) => links.find((l) => l[side] === id)
  const correctCount = links.filter((l) => l.left === l.right).length

  return (
    <div className="partb">
      <p className="hint">
        Сол жақтағы <b>тарихи деректі</b> шертіңіз, содан кейін оң жақтағы сәйкес{' '}
        <b>көркем реконструкцияны</b> шертіңіз — екеуін сызық жалғайды.
      </p>

      <div className="pb" ref={wrapRef}>
        <svg className="pb__lines" aria-hidden="true">
          {geo.map((g) => (
            <g key={g.key}>
              <path
                d={`M${g.x1},${g.y1} C${g.x1 + 60},${g.y1} ${g.x2 - 60},${g.y2} ${g.x2},${g.y2}`}
                className={`pb__line ${checked ? (g.ok ? 'is-ok' : 'is-bad') : ''}`}
              />
              <circle cx={g.x1} cy={g.y1} r="5" className={`pb__dot ${checked ? (g.ok ? 'is-ok' : 'is-bad') : ''}`} />
              <circle cx={g.x2} cy={g.y2} r="5" className={`pb__dot ${checked ? (g.ok ? 'is-ok' : 'is-bad') : ''}`} />
            </g>
          ))}
        </svg>

        <div className="pb__col">
          <h3 className="pb__head pb__head--kahar">Тарихи дерек · «Қаһар»</h3>
          {pairs.map((p) => {
            const l = linkOf('left', p.id)
            const state = checked && l ? (l.left === l.right ? 'is-ok' : 'is-bad') : ''
            return (
              <button
                key={p.id}
                type="button"
                ref={(el) => (leftRefs.current[p.id] = el)}
                className={`pb__card pb__card--kahar ${sel === p.id ? 'is-sel' : ''} ${l ? 'is-linked' : ''} ${state}`}
                onClick={() => clickLeft(p.id)}
              >
                <span className="pb__idx">{p.id}</span>
                <span className="pb__text">{p.fact}</span>
              </button>
            )
          })}
        </div>

        <div className="pb__col">
          <h3 className="pb__head pb__head--barsa">Көркем реконструкция · «Барсакелмес»</h3>
          {rights.map((p) => {
            const l = linkOf('right', p.id)
            const state = checked && l ? (l.left === l.right ? 'is-ok' : 'is-bad') : ''
            return (
              <button
                key={p.id}
                type="button"
                ref={(el) => (rightRefs.current[p.id] = el)}
                className={`pb__card pb__card--barsa ${l ? 'is-linked' : ''} ${state} ${sel !== null && !l ? 'is-target' : ''}`}
                onClick={() => clickRight(p.id)}
              >
                <span className="pb__text">{p.recon}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="pb__actions">
        <button type="button" className="btn btn--outline" onClick={clear}>
          Сызықтарды тазалау
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={check}
          disabled={checked || links.length < pairs.length}
        >
          {links.length < pairs.length ? `Жұптарды жалғаңыз (${links.length}/${pairs.length})` : 'Тексеру'}
        </button>
      </div>

      {checked && (
        <>
          <Result
            score={correctCount}
            total={pairs.length}
            hint="Әр жұпта бір ортақ мотив бар: хат, портрет, дастарқан, билік философиясы және бас сүйек."
          />
          <div className="notes">
            {pairs.map((p) => (
              <div key={p.id} className="notes__row">
                <span className="notes__n">{p.id}</span>
                <p>{p.note}</p>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn--outline" onClick={clear}>
            Қайта орындау
          </button>
        </>
      )}
    </div>
  )
}

/* ---------------- Негізгі компонент ---------------- */

export default function TaskFactRecon({ onComplete }) {
  const [stage, setStage] = useState('a')
  const [scoreA, setScoreA] = useState(0)

  return (
    <div className="fr">
      <div className="stages">
        <button type="button" className={`stage ${stage === 'a' ? 'is-active' : ''}`} onClick={() => setStage('a')}>
          <b>А-бөлім</b> Дерек пе, реконструкция ма?
        </button>
        <button type="button" className={`stage ${stage === 'b' ? 'is-active' : ''}`} onClick={() => setStage('b')}>
          <b>Б-бөлім</b> Сызықпен сәйкестендіру
        </button>
      </div>

      {stage === 'a' ? (
        <PartA
          onDone={(s) => {
            setScoreA(s)
            setStage('b')
          }}
        />
      ) : (
        <>
          {scoreA > 0 && (
            <div className="stage-note">
              А-бөлім нәтижесі: <b>{scoreA} / {statements.length}</b>
            </div>
          )}
          <PartB onDone={() => onComplete()} />
        </>
      )}
    </div>
  )
}
