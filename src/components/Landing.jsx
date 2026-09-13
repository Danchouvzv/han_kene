import { useState } from 'react'
import KazakhstanMap from './KazakhstanMap'
import { OrnamentRule, KoshkarMuiz } from './Ornament'
import heroImg from '../assets/hero-alash.jpg'

export default function Landing({ tasks, done, onOpen }) {
  const [hovered, setHovered] = useState(null)
  const total = tasks.length
  const count = tasks.filter((t) => done[t.key]).length

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero__img" style={{ backgroundImage: `url(${heroImg})` }} aria-hidden="true" />
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__inner">
          <span className="hero__kicker">Өз бетінше білім алу платформасы</span>
          <h1 className="hero__title">
            <span>Хан</span>
            <span className="ln2">Кене</span>
          </h1>
          <p className="hero__subtitle">Тарихи тұлғаны көркем реконструкциялау</p>
          <p className="hero__lead">
            Қазіргі қазақ прозасындағы Кенесары хан бейнесі: І. Есенберлиннің «Қаһар» романындағы
            тарихи шындық пен Ғ. Бекахметовтің «Барсакелмес: Көшпенділердің оралуы» шығармасындағы
            көркем реконструкцияны салыстыра отырып тану.
          </p>
          <a
            className="disc"
            href="#karta"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('karta')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            <span>Бастау</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4 V19 M5 12 L12 19 L19 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      <section className="nomad">
        <KoshkarMuiz className="nomad__orn" />
        <p className="nomad__text">
          Көшпенділер өркениеті – ұлан-ғайыр даланы мекен еткен ата-бабаларымыздан қалған, тамыры
          мыңжылдықтарға тамырласып жатқан аса бай рух пен салт-дәстүрдің алтын қазынасы. Ол –
          табиғатпен үндесіп өмір сүре білген еркін де өжет халықтың әлемдік өркениетке қосқан
          қайталанбас қолтаңбасы, ұлттық болмысымыздың таза айнасы.
        </p>
      </section>

      <section className="mapsec" id="karta">
        <div className="mapsec__head">
          <KoshkarMuiz className="mapsec__orn" />
          <h2>Тапсырмалар картасы</h2>
          <p>
            Қазақстан картасындағы алты белгінің әрқайсысы — жеке тапсырма. Белгіні басып,
            тапсырманы орындаңыз; орындалған соң белгі ✔ таңбасымен ерекшеленеді.
          </p>
          <OrnamentRule />
          <div className="progress">
            <div className="progress__bar">
              <span style={{ width: `${(count / total) * 100}%` }} />
            </div>
            <span className="progress__label">
              Орындалды: {count} / {total}
            </span>
          </div>
        </div>

        <KazakhstanMap
          tasks={tasks}
          done={done}
          onOpen={onOpen}
          hovered={hovered}
          setHovered={setHovered}
        />

        <ul className="legend">
          {tasks.map((t) => (
            <li key={t.key}>
              <button
                type="button"
                className={`lcard ${done[t.key] ? 'is-done' : ''} ${hovered === t.key ? 'is-hot' : ''}`}
                onClick={() => onOpen(t.key)}
                onMouseEnter={() => setHovered(t.key)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="lcard__n">{done[t.key] ? '✔' : t.n}</span>
                <span className="lcard__body">
                  <b>{t.n}-тапсырма: {t.title}</b>
                  <small>{t.desc}</small>
                </span>
                <span className="lcard__go" aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="compare">
        <h2 className="compare__h">Екі шығарма — бір тұлға</h2>
        <OrnamentRule />
        <div className="compare__grid">
          <div className="ccol ccol--kahar">
            <h3>«Қаһар» · І. Есенберлин</h3>
            <ul>
              <li><b>Дәуір:</b> XIX ғасырдың тарихи шындығы</li>
              <li><b>Тұлға бейнесі:</b> қайсар хан, қолбасшы, қайраткер</li>
              <li><b>Күрес арқауы:</b> отаршылдық жүйеге қарсы ұлт-азаттық қозғалыс</li>
              <li><b>Мақсаты:</b> ел тәуелсіздігі мен жер тұтастығын қорғау</li>
            </ul>
          </div>
          <div className="ccol ccol--barsa">
            <h3>«Барсакелмес» · Ғ. Бекахметов</h3>
            <ul>
              <li><b>Дәуір:</b> көркем модельдеу &amp; цифрлық шындық</li>
              <li><b>Тұлға бейнесі:</b> эрудит лидер, дипломат, саясаткер</li>
              <li><b>Тәрбие көзі:</b> «Аттила» білім ошағы, 1001 кітап стратегиясы</li>
              <li><b>Мақсаты:</b> көшпелі мәдениетті қайта жаңғырту</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
