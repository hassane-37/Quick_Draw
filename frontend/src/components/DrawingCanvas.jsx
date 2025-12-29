import { useEffect, useRef, useState } from 'react'

function DrawingCanvas({ width = 400, height = 400, onChange, clearTrigger }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#000'

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  useEffect(() => {
    if (!clearTrigger) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
     
    if (onChange) {
      onChange(null)
    }
  }, [clearTrigger, onChange])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    setLastPoint(getPos(e))
  }

  const draw = (e) => {
    if (!isDrawing || !lastPoint) return

    const newPoint = getPos(e)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(newPoint.x, newPoint.y)
    ctx.stroke()

    setLastPoint(newPoint)
  }

  const stopDrawing = () => {
    if (!isDrawing) return

    setIsDrawing(false)
    setLastPoint(null)

    if (onChange) {
      const canvas = canvasRef.current
      const dataUrl = canvas.toDataURL('image/png')
      onChange(dataUrl)
    }
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (onChange) {
      onChange(null)
    }
  }

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <button type="button" onClick={handleClear} className="secondary-button">
        Effacer
      </button>
    </div>
  )
}

export default DrawingCanvas
