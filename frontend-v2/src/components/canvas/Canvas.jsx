import { useEffect, useRef, useState } from "react";
import "./Canvas.css";
import StatPage from "../../pages/StatePage";

// LSTM model labels (10 classes) - used for LSTM predictions
// const LABELS = ["Bicycle", "Eiffel Tower", "Pizza", "Cat", "Cloud", "Apple", "Tree", "Car", "Sun", "House"];
const LABELS = [
  "The Eiffel Tower",  // index 0 ← capital T sorts first!
  "Apple",             // index 1
  "Bicycle",           // index 2
  "Car",               // index 3
  "Cat",               // index 4
  "Cloud",             // index 5
  "House",             // index 6
  "Pizza",             // index 7
  "Sun",               // index 8
  "Tree"               // index 9
];

// CNN model labels - MUST match LabelEncoder's alphabetical order from training
// Training classes: ["bicycle", "The Eiffel Tower", "pizza", "cat", "cloud", "apple", "tree", "car", "sun", "house"]
// ⚠️ CRITICAL: "The Eiffel Tower" has capital T → sorts FIRST in Python (capitals < lowercase in ASCII)
// After LabelEncoder.fit_transform(): ['The Eiffel Tower', 'apple', 'bicycle', 'car', 'cat', 'cloud', 'house', 'pizza', 'sun', 'tree']
const CNN_LABELS = [
  "The Eiffel Tower",  // index 0 ← capital T sorts first!
  "Apple",             // index 1
  "Bicycle",           // index 2
  "Car",               // index 3
  "Cat",               // index 4
  "Cloud",             // index 5
  "House",             // index 6
  "Pizza",             // index 7
  "Sun",               // index 8
  "Tree"               // index 9
];

export default function DrawingCanvas({ 
  roundsCount = 6, 
  keywords = ["The Eiffel Tower", "Apple", "Bicycle", "Car", "Cat", "Cloud", "House", "Pizza", "Sun", "Tree"],
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
  const [processedImage, setProcessedImage] = useState(""); // Image du modèle

  // Select appropriate labels array based on route
  const currentLabels = route === 'predict_cnn' ? CNN_LABELS : LABELS;

  /* ------------------ SAUVEGARDE EN BASE ------------------ */
  const saveGameToBackend = async (predictions) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping save");
        return;
      }

      const decoded = jwtDecode(token);
      const user_id = decoded.sub || decoded.username || decoded["cognito:username"];

      console.log("💾 Saving game for user:", user_id);
      console.log("📊 Predictions:", predictions);

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

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Game saved successfully:", data);
      } else {
        console.error("❌ Failed to save game:", data);
      }
    } catch (err) {
      console.error("❌ Error saving game:", err);
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
        
        // Validate predicted_index
        if (result.predicted_index < 0 || result.predicted_index >= currentLabels.length) {
          console.error(`Invalid predicted_index: ${result.predicted_index} (expected 0-${currentLabels.length - 1})`);
          setPrediction("Error: Invalid prediction");
          return;
        }
        
        // Set prediction using appropriate labels
        setPrediction(currentLabels[result.predicted_index]);
        
        // Store processed image if available
        if (result.image_base64) {
          setProcessedImage(result.image_base64);
        }
        
        setConfidence(result.confidence_percentage);
      }
    } catch (err) {
      console.error("CORS or Connection Error. Check if your backend has CORS enabled.", err);
    }
  };

  const clearCanvas = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setDrawingData([]); 
    setPrediction("");
    setConfidence(0);
  };

  const nextRound = () => {
    
    setTransition(true);
    setTimeout(() => {
      clearCanvas();
      setTimeLeft(20);
      setRound((r) => (r + 1 < roundsCount ? r + 1 : 0));
      setTransition(false);
    }, 500);
    setGamePrediction(prev => [...prev, {word: keywords[round], prediction, confidence}]);
    console.log("Game Predictions so far:", gamePrediction);
    if (round + 1 === roundsCount) {
        setGameOver(true);
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
      const timeoutId = setTimeout(() => {
        nextRound();
      }, 0);
      return () => clearTimeout(timeoutId);
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
    setProcessedImage(""); // Réinitialiser l'image
  };

  const nextRound = () => {
    // Créer l'objet de prédiction pour ce round
    const newPrediction = { 
      word: keywords[round], 
      prediction, 
      confidence 
    };
    const updatedPredictions = [...gamePrediction, newPrediction];
    
    setTransition(true);
    setTimeout(() => {
      clearCanvas();
      setTimeLeft(20);
      setRound((r) => (r + 1 < roundsCount ? r + 1 : 0));
      setTransition(false);
    }, 500);
    
    setGamePrediction(updatedPredictions);
    console.log("📝 Round", round + 1, "completed:", newPrediction);

    // Si c'est le dernier round, sauvegarder la partie
    if (round + 1 === roundsCount) {
      console.log("🎮 Game finished! Saving to database...");
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

      {/* I SEE... FLOATING UI */}
      {prediction && (
        <div className="prediction-bubble">
          <p>I see <strong>{prediction}</strong></p>
          <div className="confidence-tag">{confidence.toFixed(1)}%</div>
        </div>
      )}

      {/* Affichage de l'image vue par le modèle (commenté) */}
      {/* {processedImage && (
        <div className="processed-image-preview">
          <div className="preview-label">Model Input:</div>
          <img src={processedImage} alt="Processed drawing" />
        </div>
      )} */}

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