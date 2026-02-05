import React, { useEffect, useRef, useState } from "react";
import "./Canvas.css";
import WaitingScreen from "../WaitingScreen/WaitingScreen";
import { useWebSocket } from "../../webSocket/SocketContext";
import { useSearchParams } from "react-router-dom";
import MultiplayerStatPage from "../../pages/StatePageMulti";

const LABELS = ["Bicycle", "Eiffel Tower", "Pizza", "Cat", "Cloud", "Apple", "Tree", "Car", "Sun", "House"];
const CNN_LABELS = ["Apple", "Bicycle", "Dog", "Bird", "Hammer", "Cat", "Car", "House", "Tree"];

function DrawingCanvasMultiPlayer({
  roundsCount = 6,
  keywords = ["Tree", "Pizza", "Car", "House", "Cloud", "Sun"],
  route = "predict",
}) {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("session");
  const wsRef = useWebSocket();

  // --- Identity & Match State ---
  // Generate a unique ID for this player session
  const [myId] = useState(() => "p_" + Math.random().toString(36).substr(2, 9));
  const [matchId, setMatchId] = useState(null);
  const [gameReady, setGameReady] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bothPlayersEnded, setBothPlayersEnded] = useState(false);

  // --- Game State ---
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [transition, setTransition] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [gamePrediction, setGamePrediction] = useState([]);
  const [opponentResults, setOpponentResults] = useState(null);

  // --- Refs ---
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const [drawingData, setDrawingData] = useState([]);

  const effectiveKeywords = route === "predict_cnn" 
    ? ["Apple", "House", "Cat", "Tree", "Bicycle", "Dog"] 
    : keywords;

  // --- WebSocket Logic ---
  useEffect(() => {
    if (!wsRef.current) return;

    const socket = wsRef.current;

    const joinGame = () => {
      const type = code === "online" ? "CREATE_GAME_ONLINE" : "CHECK_GAME";
      socket.send(JSON.stringify({ type, id: myId, code: code }));
    };

    if (socket.readyState === WebSocket.OPEN) {
      joinGame();
    } else {
      socket.onopen = joinGame;
    }

    const handleMessage = (message) => {
      const data = JSON.parse(message.data);

      // Handle Match Start
      if (data.type === "GAME_STATUS_ONLINE" || (data.type === "GAME_STATUS" && data.exists)) {
        setMatchId(data.matchId);
        setGameReady(true);
      }

      // Handle Final Results Sync
      if (data.type === "BOTH_PLAYERS_ENDED") {
        const allResults = data.results;
        // Find the result that isn't mine
        const opponentId = Object.keys(allResults).find((id) => id !== myId);
        setOpponentResults(allResults[opponentId]);
        setBothPlayersEnded(true);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [code, myId, wsRef]);

  // --- ML API Call ---
  const sendToML = async (dataToSend) => {
    if (dataToSend.length < 5) return;
    try {
      const response = await fetch(`http://localhost:8000/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataToSend }),
      });
      if (!response.ok) return;
      const result = await response.json();
      const labels = route === "predict_cnn" ? CNN_LABELS : LABELS;
      setPrediction(labels[result.predicted_index] || "thinking...");
      setConfidence(result.confidence_percentage);
    } catch (err) {
      console.error("Backend error", err);
    }
  };

  // --- Canvas Setup ---
  useEffect(() => {
    if (gameReady && canvasRef.current) {
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
    }
  }, [gameReady]);

  // --- Timer ---
  useEffect(() => {
    if (!gameReady || gameOver || transition) return;
    if (timeLeft === 0) {
      nextRound();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameReady, gameOver, transition]);

  // --- Drawing Logic ---
  const getXY = (e) => {
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX, y: point.clientY };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getXY(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    lastPos.current = { x, y };
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getXY(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    setDrawingData((prev) => [...prev, [dx, dy, 1]]);
    lastPos.current = { x, y };
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    ctxRef.current.closePath();
    setDrawingData((prev) => {
      if (!prev.length) return prev;
      const updated = [...prev];
      updated[updated.length - 1][2] = 0; // End of stroke
      sendToML(updated);
      return updated;
    });
  };

  const clearCanvas = () => {
    ctxRef.current?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setDrawingData([]);
    setPrediction("");
    setConfidence(0);
  };

  // --- Game Progression ---
  const nextRound = () => {
    const currentResult = {
      word: effectiveKeywords[round],
      prediction,
      confidence,
    };

    const updatedPredictions = [...gamePrediction, currentResult];
    setGamePrediction(updatedPredictions);

    if (round + 1 >= roundsCount) {
      setGameOver(true);
      // Send final results to server immediately
      wsRef.current?.send(JSON.stringify({
        type: "PLAYER_ENDED",
        matchId: matchId,
        id: myId,
        predictions: updatedPredictions,
      }));
    } else {
      setTransition(true);
      setTimeout(() => {
        clearCanvas();
        setTimeLeft(20);
        setRound((r) => r + 1);
        setTransition(false);
      }, 500);
    }
  };

  // --- Render Logic ---
  if (!gameReady) return <WaitingScreen message="Looking for an opponent..." />;

  if (gameOver) {
    if (!bothPlayersEnded) {
      return <WaitingScreen message="Waiting for opponent to finish..." />;
    }
    return (
      <MultiplayerStatPage
        player1Name="You"
        player2Name="Opponent"
        player1Stats={gamePrediction}
        player2Stats={opponentResults}
      />
    );
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
      />

      <div className="ui-overlay top-ui">
        <div className="info-pill round-pill">
          <span className="label">ROUND</span>
          <span className="value">{round + 1} / {roundsCount}</span>
        </div>
        <div className="prompt-pill">
          <span className="sub">Draw:</span>
          <span className="main-word">{effectiveKeywords[round]}</span>
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

export default DrawingCanvasMultiPlayer;