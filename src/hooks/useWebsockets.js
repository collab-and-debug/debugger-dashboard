import { useState, useEffect, useRef, useCallback } from 'react';

const RECONNECT_DELAY = 3000;

export default function useWebSocket(sessionId) {
  const [messages, setMessages]         = useState([]);
  const [connectionStatus, setStatus]   = useState('Connecting');
  const wsRef                           = useRef(null);
  const reconnectTimer                  = useRef(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(`ws://localhost:5000?sessionId=${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => setStatus('Connected');

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setMessages(prev => [...prev.slice(-19), parsed]); // keep last 20
    };

    ws.onclose = () => {
      setStatus('Disconnected');
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
    };

    ws.onerror = () => ws.close(); // triggers onclose → reconnect
  }, [sessionId]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((payload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  return { messages, sendMessage, connectionStatus };
}