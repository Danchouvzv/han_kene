import { useEffect } from 'react'
import { kaharBlock, barsaBlock, resources } from '../data/theory'
import keneImg from '../assets/kene.jpg'
import alashImg from '../assets/alash.jpg'
import { OrnamentRule, Yurt } from './Ornament'

function Block({ b, img, imgAlt }) {
  return (
    <article className={`tblock tblock--${b.key}`}>
      <div className="tblock__media">
        <img src={img} alt={imgAlt} loading="lazy" />
        <span className="tblock__tag">{b.tag}</span>
      </div>

      <div className="tblock__inner">
        <h2 className="tblock__title">{b.title}</h2>
        <p className="tblock__sub">{b.subtitle}</p>

        <dl className="tblock__facts">
          {b.facts.map(([k, v]) => (
            <div key={k} className="fact">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <p className="tblock__lead">{b.intro}</p>
        <p className="tblock__text">{b.novel}</p>

        {b.sections.map((s) => (
          <section key={s.head} className="tblock__section">
            <h3>{s.head}</h3>
            <ul>
              {s.items.map(([k, v]) => (
                <li key={k}>
                  <b>{k}:</b> {v}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  )
}

export default function TaskTheory({ onComplete }) {
  useEffect(() => {
    onComplete()
  }, [onComplete])

  return (
    <div className="theory">
      <div className="theory__grid">
        <Block b={kaharBlock} img={keneImg} imgAlt="Тарихи Кенесары хан" />
        <Block b={barsaBlock} img={alashImg} imgAlt="Көркем реконструкциядағы Кенесары бейнесі" />
      </div>

      <section className="res">
        <div className="res__head">
          <Yurt className="res__icon" />
          <div>
            <h2>Ресурстар: Кенесары хан туралы қысқаша анықтама</h2>
            <p>Тесттер мен сәйкестендіру тапсырмаларына кіріспес бұрын оқып шығыңыз.</p>
          </div>
        </div>
        <OrnamentRule />
        <div className="res__grid">
          {resources.map((r) => (
            <div key={r.t} className="res__card">
              <h4>{r.t}</h4>
              <p>{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="theory__note">
        Бұл бөлім — ақпараттық. Оқып шыққан соң картадағы келесі белгіге өтіңіз.
      </div>
    </div>
  )
}
