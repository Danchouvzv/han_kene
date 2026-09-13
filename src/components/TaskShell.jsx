import { OrnamentRule } from './Ornament'

export default function TaskShell({ task, onBack, onNext, nextTask, done, children }) {
  return (
    <div className="task">
      <div className="task__bar">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          <span aria-hidden="true">←</span> Картаға оралу
        </button>
        <span className={`task__state ${done ? 'is-done' : ''}`}>
          {done ? '✔ Орындалды' : `${task.n}-тапсырма`}
        </span>
      </div>

      <header className="task__head">
        <span className="task__kicker">{task.n}-тапсырма</span>
        <h1 className="task__title">{task.title}</h1>
        <p className="task__sub">{task.desc}</p>
        <OrnamentRule />
      </header>

      <div className="task__body">{children}</div>

      <footer className="task__foot">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← Картаға оралу
        </button>
        {nextTask && (
          <button type="button" className="btn btn--primary" onClick={() => onNext(nextTask.key)}>
            {nextTask.n}-тапсырма: {nextTask.title} <span aria-hidden="true">→</span>
          </button>
        )}
      </footer>
    </div>
  )
}
