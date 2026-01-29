function PredictionPanel({ predictions, targetWord }) {
  return (
    <div className="prediction-panel">
      <h2>Prédictions du modèle</h2>
      <p className="target-word">Mot à dessiner : <strong>{targetWord}</strong></p>
      {predictions.length === 0 ? (
        <p className="muted">Commence à dessiner pour voir les prédictions…</p>
      ) : (
        <ol>
          {predictions.map((e) => (
            <li>
              {e}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default PredictionPanel
