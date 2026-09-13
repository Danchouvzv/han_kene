import { useCallback, useEffect, useState } from 'react'
import Landing from './components/Landing'
import TaskShell from './components/TaskShell'
import TaskTheory from './components/TaskTheory'
import TaskQuiz from './components/TaskQuiz'
import TaskTerms from './components/TaskTerms'
import TaskQuoteMatch from './components/TaskQuoteMatch'
import TaskTruthRecon from './components/TaskTruthRecon'
import TaskPortrait from './components/TaskPortrait'
import { OrnamentCorners } from './components/Ornament'
import { startMusic, stopMusic, unlock, playClick } from './audio'
import logoMark from './assets/logo-mark.png'

export const TASKS = [
  {
    key: 'teoriya',
    n: 1,
    title: 'Теория және ресурстар',
    desc: 'Тарихи негіз бен «Қаһар» романы, «Барсакелмес» шығармасы және Кенесары туралы анықтамалық материал.',
  },
  {
    key: 'test',
    n: 2,
    title: 'Тұлғаны тану',
    desc: 'Теориялық материалмен танысып, Кенесары бейнесі бойынша 10 сұрақтан тұратын экспресс-тестті орындаңыз.',
  },
  {
    key: 'derek',
    n: 3,
    title: 'Тарих пен көркем сөз',
    desc: 'Тарихи дерек пен көркем реконструкцияны сызықпен сәйкестендіру.',
  },
  {
    key: 'term',
    n: 4,
    title: 'Сөзжұмбақ пен сәйкестендіру',
    desc: 'Көркем шығарма үзінділері және терминологиялық сәйкестендіру.',
  },
  {
    key: 'shyndyq',
    n: 5,
    title: 'Шындық пен көркемдік реконструкция',
    desc: 'Берілген сөйлемнің тарихи дерек пе, әлде авторлық көркем реконструкциялау ма екенін анықтаңыз.',
  },
  {
    key: 'portret',
    n: 6,
    title: 'Жаңа Кенесары портреті',
    desc: 'Жаңа Кенесарының бейнесін тану: 12 деректің ішінен «Барсакелмес» деректерін таңдау.',
  },
]

const STORE = 'kenesary-progress-v1'

function loadDone() {
  try {
    return JSON.parse(localStorage.getItem(STORE)) || {}
  } catch {
    return {}
  }
}

export default function App() {
  const [view, setView] = useState('home')
  const [done, setDone] = useState(loadDone)
  const [music, setMusic] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(done))
    } catch {
      /* ignore */
    }
  }, [done])

  // Навигация төмен түскенде «жинақталады» — жүзу эффектісі
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Дыбысты мүмкіндігінше ертерек «ашу»: браузерлер (әсіресе мобильде)
  // AudioContext-ті тек шынайы пайдаланушы әрекетінен кейін ғана іске
  // қосады, сондықтан бетпен алғашқы жанасудың өзінде дереу ашамыз —
  // жауап батырмасын басқанда дыбыс кешікпей/үнсіз қалмауы үшін.
  useEffect(() => {
    const onFirstInteract = () => unlock()
    const opts = { once: true, passive: true, capture: true }
    window.addEventListener('pointerdown', onFirstInteract, opts)
    window.addEventListener('touchstart', onFirstInteract, opts)
    window.addEventListener('keydown', onFirstInteract, opts)
    return () => {
      window.removeEventListener('pointerdown', onFirstInteract, opts)
      window.removeEventListener('touchstart', onFirstInteract, opts)
      window.removeEventListener('keydown', onFirstInteract, opts)
    }
  }, [])

  useEffect(() => {
    // жаңа бөлімге өткенде беттің басына секіру
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [view])

  const complete = useCallback((key) => {
    setDone((d) => (d[key] ? d : { ...d, [key]: true }))
  }, [])

  function open(key) {
    unlock()
    playClick()
    setView(key)
  }

  function toggleMusic() {
    if (music) {
      stopMusic()
      setMusic(false)
    } else {
      startMusic()
      setMusic(true)
    }
  }

  function resetProgress() {
    setDone({})
    try {
      localStorage.removeItem(STORE)
    } catch {
      /* ignore */
    }
  }

  const task = TASKS.find((t) => t.key === view)
  const nextTask = task ? TASKS[TASKS.findIndex((t) => t.key === view) + 1] : null

  const body = () => {
    switch (view) {
      case 'teoriya':
        return <TaskTheory onComplete={() => complete('teoriya')} />
      case 'test':
        return <TaskQuiz onComplete={() => complete('test')} />
      case 'derek':
        return <TaskQuoteMatch onComplete={() => complete('derek')} />
      case 'term':
        return <TaskTerms onComplete={() => complete('term')} />
      case 'shyndyq':
        return <TaskTruthRecon onComplete={() => complete('shyndyq')} />
      case 'portret':
        return <TaskPortrait onComplete={() => complete('portret')} />
      default:
        return null
    }
  }

  return (
    <div className="app" data-view={view}>
      <OrnamentCorners />

      <header className={`topbar ${scrolled ? 'is-compact' : ''}`}>
        <div className="topbar__glow" aria-hidden="true" />

        <button type="button" className="brand" onClick={() => setView('home')}>
          <span className="brand__mark" aria-hidden="true">
            <img src={logoMark} alt="" />
          </span>
          <span className="brand__text">
            <b>Хан Кене</b>
            <small>Көркем реконструкция</small>
          </span>
        </button>

        <div className="topbar__right">
          <button
            type="button"
            className="progress-ring"
            onClick={() => setView('home')}
            title="Тапсырмалар картасына өту"
            aria-label={`Орындалды: ${TASKS.filter((t) => done[t.key]).length} / ${TASKS.length}`}
          >
            <svg viewBox="0 0 44 44" className="progress-ring__svg">
              <circle cx="22" cy="22" r="18" className="progress-ring__track" />
              {TASKS.map((t, i) => {
                const R = 18
                const C = 2 * Math.PI * R
                const slot = C / TASKS.length
                const gapLen = 5.5
                const drawLen = slot - gapLen
                const angleDeg = -90 + (i * slot * 360) / C
                return (
                  <circle
                    key={t.key}
                    cx="22" cy="22" r={R}
                    className={`progress-ring__seg ${done[t.key] ? 'is-done' : ''}`}
                    strokeDasharray={`${drawLen} ${C - drawLen}`}
                    style={{ transform: `rotate(${angleDeg}deg)`, transitionDelay: `${i * 60}ms` }}
                  />
                )
              })}
            </svg>
            <span className="progress-ring__num">{TASKS.filter((t) => done[t.key]).length}</span>
          </button>

          <span className="topbar__divider" aria-hidden="true" />

          <button
            type="button"
            className={`sound ${music ? 'is-on' : ''}`}
            onClick={toggleMusic}
            aria-pressed={music}
            title={music ? 'Фондық әуенді өшіру' : 'Фондық әуенді қосу'}
          >
            <span className="sound__bars" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
            <span className="sound__label">{music ? 'Әуен қосулы' : 'Әуен өшулі'}</span>
          </button>
        </div>
      </header>

      <main className="main">
        {view === 'home' ? (
          <Landing tasks={TASKS} done={done} onOpen={open} />
        ) : (
          <TaskShell
            task={task}
            done={!!done[view]}
            onBack={() => setView('home')}
            onNext={open}
            nextTask={nextTask}
          >
            {body()}
          </TaskShell>
        )}
      </main>

      <footer className="foot">
        <div className="foot__in">
          <p>
            <b>Тақырып:</b> «Қазіргі қазақ прозасындағы тарихи тұлғаны көркем реконструкциялау» ·
            тарихи тұлға — Кенесары хан
          </p>
          <button type="button" className="foot__reset" onClick={resetProgress}>
            Нәтижелерді тазалау
          </button>
        </div>
      </footer>
    </div>
  )
}
