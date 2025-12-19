import { useEffect, useState } from 'react'
import DrawingCanvas from '../components/DrawingCanvas'
import PredictionPanel from '../components/PredictionPanel'


const MOCK_WORDS = [
  { word: 'chat', category: 'animaux' },
  { word: 'maison', category: 'objets' },
  { word: 'pizza', category: 'aliments' },
]



function GamePage({ user, onLogout, onGameFinished }) {
  const [currentWord, setCurrentWord] = useState(MOCK_WORDS[0])
  const [predictions, setPredictions] = useState([])

  const ROUND_DURATION = 20
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(ROUND_DURATION)

  const handleValidate = () => {
    const timeTaken = elapsed
    const attempts = predictions.length

    onGameFinished({
      word: currentWord.word,
      category: currentWord.category,
      time: timeTaken,
      attempts,
    })
  }

  useEffect(() => {
    setStartTime(Date.now())
    setElapsed(ROUND_DURATION)

    const interval = setInterval(() => {
      if (!startTime) return

      const elapsed = Math.floor((Date.now()-startTime) / 1000)
      const newRemaining = Math.max(ROUND_DURATION - elapsed, 0)
      setElapsed(newRemaining)

      if (newRemaining === 0) {
        clearInterval(interval)
        handleValidate()
      }
    }, 500)

    return () => clearInterval(interval)
  }, [startTime])

  const handleNewDrawing = (dataUrl) => {
    if (!dataUrl) {
      setPredictions([])
      return
    }

    const labels = ['chat', 'chien', 'maison', 'pizza']
    const randomPreds = labels.map((label) => ({
      label,
      prob: Math.random(),
    }))

    randomPreds.sort((a, b) => b.prob - a.prob)
    setPredictions(randomPreds.slice(0, 3))
  }

  

  const handleNextWord = () => {
    const idx = MOCK_WORDS.findIndex((w) => w.word === currentWord.word)
    const next = MOCK_WORDS[(idx + 1) % MOCK_WORDS.length]
    setCurrentWord(next)
    setPredictions([])
    setStartTime(Date.now())
    setElapsed(0)
  }

  return (
    <div className="game-layout">
      <header className="game-header">
        <div>
          <h1>Quick Draw - FISE3</h1>
          <p>
            Connecté en tant que <strong>{user.email}</strong>
          </p>
        </div>
        <button type="button" onClick={onLogout} className="secondary-button">
          Se déconnecter
        </button>
      </header>

      <main className="game-main">
        <section className="left-panel">
          <h2>
            Dessine : <span className="highlight">{currentWord.word}</span>
          </h2>
          <p className="muted">Catégorie : {currentWord.category}</p>
          <p className="timer">Temps écoulé : {elapsed}s</p>
          <DrawingCanvas onChange={handleNewDrawing} />
          <div className="game-actions">
            <button type="button" onClick={handleValidate}>
              Valider ce mot
            </button>
            <button type="button" onClick={handleNextWord} className="secondary-button">
              Mot suivant
            </button>
          </div>
        </section>

        <section className="right-panel">
          <PredictionPanel predictions={predictions} targetWord={currentWord.word} />
        </section>
      </main>
    </div>
  )
}

export default GamePage
