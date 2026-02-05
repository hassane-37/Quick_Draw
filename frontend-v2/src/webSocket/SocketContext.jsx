// websocket/WebSocketContext.js
import { createContext, useContext, useEffect, useRef } from "react";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:4000");

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={wsRef}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const wsRef = useContext(WebSocketContext);
  if (!wsRef) {
    throw new Error("useWebSocket must be used inside WebSocketProvider");
  }
  return wsRef;
}
