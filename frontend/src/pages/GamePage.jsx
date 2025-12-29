import { useEffect, useState, useRef } from 'react'
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
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(ROUND_DURATION)
  const [clearKey, setClearKey] = useState(0)
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const handleValidate = () => {
    const timeTaken = ROUND_DURATION - elapsed
    const attempts = predictions.length

    onGameFinished({
      word: currentWord.word,
      category: currentWord.category,
      time: timeTaken,
      attempts,
    })
  }

  useEffect(() => {
    setElapsed(ROUND_DURATION)

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
      const newRemaining = Math.max(ROUND_DURATION - elapsedSeconds, 0)
      setElapsed(newRemaining)

      if (newRemaining === 0) {
        clearInterval(interval)
        // Basculer automatiquement au mot suivant
        handleNextWord()
      }
    }, 500)

    return () => clearInterval(interval)
  }, [startTime])

  const handleNewDrawing = async (dataUrl) => {
    if (!dataUrl) {
      setPredictions([])
      return
    }

    try {
      const res = await fetch('http://localhost:3000/api/ml/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: dataUrl }),
      })

      if (!res.ok) {
        console.error('Erreur HTTP lors de la prédiction', res.status)
        return
      }

      const json = await res.json()
      if (json.success && json.data && Array.isArray(json.data.predictions)) {
        setPredictions(json.data.predictions)
      } else {
        setPredictions([])
      }
    } catch (err) {
      console.error('Erreur réseau lors de la prédiction', err)
    }
  }

  const initCanvas = (canvas) => {
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
  }

  const handleMouseDown = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const handleMouseMove = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/png')
    handleNewDrawing(dataUrl)
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    initCanvas(canvas)
    handleNewDrawing(null)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      initCanvas(canvas)
    }
  }, [clearKey])

  const handleNextWord = () => {
    const idx = MOCK_WORDS.findIndex((w) => w.word === currentWord.word)
    const next = MOCK_WORDS[(idx + 1) % MOCK_WORDS.length]
    setCurrentWord(next)
    setPredictions([])
    setClearKey((k) => k + 1)
    // Réinitialiser le timer en dernier pour déclencher le useEffect
    setTimeout(() => {
      setStartTime(Date.now())
    }, 0)
  }

 return (
  <div className="container py-4">
    <header className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 className="h3 mb-1">Quick Draw - FISE3</h1>
        <p className="mb-0 text-muted">
          Connecté en tant que <strong>{user.email}</strong>
        </p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="btn btn-outline-secondary"
      >
        Se déconnecter
      </button>
    </header>

    <main className="row g-4">
      {/* Colonne gauche : dessin */}
      <section className="col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5 mb-2">
              Dessine :{' '}
              <span className="text-primary fw-bold">
                {currentWord.word}
              </span>
            </h2>
            <p className="mb-1 text-muted">
              Catégorie : {currentWord.category}
            </p>
            <p className="mb-3 fw-semibold">
              Temps restant : {elapsed}s
            </p>

            <div className="mb-3 d-flex justify-content-center">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  border: '2px solid #333',
                  cursor: 'crosshair',
                  touchAction: 'none',
                  backgroundColor: '#fff',
                  borderRadius: '0.25rem',
                }}
              />
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-outline-secondary"
              >
                Effacer
              </button>
              <button
                type="button"
                onClick={handleValidate}
                className="btn btn-primary"
              >
                Valider ce mot
              </button>
              <button
                type="button"
                onClick={handleNextWord}
                className="btn btn-warning"
              >
                Mot suivant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Colonne droite : prédictions */}
      <section className="col-lg-5">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <PredictionPanel
              predictions={predictions}
              targetWord={currentWord.word}
            />
          </div>
        </div>
      </section>
    </main>
  </div>
)
}

export default GamePage