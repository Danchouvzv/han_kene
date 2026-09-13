export default function Result({ score, total, hint }) {
  const ratio = total ? score / total : 0
  const tone = ratio === 1 ? 'perfect' : ratio >= 0.6 ? 'good' : 'weak'
  const label = ratio === 1 ? 'Тамаша!' : ratio >= 0.6 ? 'Жақсы нәтиже' : 'Қайталап көріңіз'
  return (
    <div className={`result result--${tone}`} role="status">
      <div className="result__score">
        <strong>{score}</strong>
        <span>/ {total}</span>
      </div>
      <div className="result__text">
        <b>{label}</b>
        <p>{hint}</p>
      </div>
    </div>
  )
}
