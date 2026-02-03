import { useEffect, useRef, useState } from "react";
import "./Canvas.css";
import StatPage from "../../pages/StatePage";
import { jwtDecode } from "jwt-decode";

const LABELS = ["Bicycle", "Eiffel Tower", "Pizza", "Cat", "Cloud", "Apple", "Tree", "Car", "Sun", "House"];
const CNN_LABELS = ["Car","Bycicle","Dog","Bird","Hammer","Cat","Apple","House","Tree"];

export default function DrawingCanvas({ 
  roundsCount = 6, 
  keywords = ["Tree", "Pizza", "Car", "House", "Cloud","Sun"],
   route = "predict"
}) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  
  const lastPos = useRef({ x: 0, y: 0 });
  
  const [drawingData, setDrawingData] = useState([]);
  
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [transition, setTransition] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(0);

  const [gamePrediction, setGamePrediction] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  if (route=='predict_cnn') {
    keywords = ['Apple','House','Cat','Tree','Bycicle','Dog'];
  }

  /* ------------------ Save Game to Backend ------------------ */
  const saveGameToBackend = async (predictions) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping save");
        return;
      }

      const decoded = jwtDecode(token);
      const user_id = decoded.sub || decoded.username || decoded["cognito:username"];

      console.log("Saving game for user:", user_id);

      const response = await fetch("http://localhost:4000/api/games/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id,
          model_type: route === "predict_cnn" ? "cnn" : "lstm",
          rounds: predictions
        })
      });

      if (response.ok) {
        console.log("Game saved successfully");
      } else {
        console.error("Failed to save game:", await response.text());
      }
    } catch (err) {
      console.error("Error saving game:", err);
    }
  };

  /* ------------------ API Function ------------------ */
  const sendToML = async (dataToSend) => {
    if (dataToSend.length < 5) return;

    try {
      const response = await fetch("http://localhost:8000/"+route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataToSend }),
      });

      if (response.ok) {
        const result = await response.json();
        if (route=='predict_cnn'){
          setPrediction(CNN_LABELS[result.predicted_index] || "something...");
        }
        else{
        setPrediction(LABELS[result.predicted_index] || "something...");
        }
        setConfidence(result.confidence_percentage);
      }
    } catch (err) {
      console.error("CORS or Connection Error. Check if your backend has CORS enabled.", err);
    }
  };

 
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#1a1a1a";
    };

    resize();
    window.addEventListener("resize", resize);
    ctxRef.current = ctx;
    return () => window.removeEventListener("resize", resize);
  }, []);


  useEffect(() => {
    if (timeLeft === 0) {
      nextRound();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, round]);

 
  const getXY = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX, y: clientY };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getXY(e);
    
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);

    let dx = 0;
    let dy = 0;

    if (drawingData.length > 0) {
      dx = x - lastPos.current.x;
      dy = y - lastPos.current.y;
    }

    setDrawingData(prev => [...prev, [dx, dy, 1]]);
    lastPos.current = { x, y };
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getXY(e);
    
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();

    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;

    setDrawingData(prev => [...prev, [dx, dy, 1]]);
    
    lastPos.current = { x, y };
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    ctxRef.current.closePath();

    setDrawingData(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1][2] = 0; 
      
      sendToML(updated);
      return updated;
    });
  };

  const clearCanvas = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setDrawingData([]); 
    setPrediction("");
    setConfidence(0);
  };

  const nextRound = () => {
    const newPrediction = { word: keywords[round], prediction, confidence };
    const updatedPredictions = [...gamePrediction, newPrediction];
    
    setTransition(true);
    setTimeout(() => {
      clearCanvas();
      setTimeLeft(20);
      setRound((r) => (r + 1 < roundsCount ? r + 1 : 0));
      setTransition(false);
    }, 500);
    
    setGamePrediction(updatedPredictions);
    console.log("Game Predictions so far:", updatedPredictions);
    
    if (round + 1 === roundsCount) {
      saveGameToBackend(updatedPredictions);
      setGameOver(true);
    }
  };

  if (gameOver) {
    return <StatPage stats={gamePrediction} />;
  }

  return (
    <div className={`fullscreen-app ${transition ? "fade-out" : ""}`}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ cursor: 'pointer' }}
      />

      <div className="ui-overlay top-ui">
        <div className="info-pill round-pill">
          <span className="label">ROUND</span>
          <span className="value">{round + 1} / {roundsCount}</span>
        </div>
        <div className="prompt-pill">
          <span className="sub">Draw:</span>
          <span className="main-word">{keywords[round]}</span>
        </div>
        <div className={`timer-pill ${timeLeft <= 5 ? "danger" : ""}`}>
          <div className="timer-val">{timeLeft}</div>
        </div>
      </div>

      {prediction && (
        <div className="prediction-bubble">
          <p>I see <strong>{prediction}</strong></p>
          <div className="confidence-tag">{confidence.toFixed(1)}%</div>
        </div>
      )}

      <div className="ui-overlay bottom-ui">
        <div className="actions-bar">
          <button className="action-btn secondary" onClick={clearCanvas}>Clear</button>
          <button className="action-btn primary" onClick={nextRound}>
            {round + 1 === roundsCount ? "Finish" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}