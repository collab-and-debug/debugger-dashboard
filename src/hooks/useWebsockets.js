import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const RECONNECT_DELAY = 3000;

export default function useWebSocket(sessionId) {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    // ✅ FIX: use env variable instead of localhost
    const WS_URL = import.meta.env.VITE_WS_URL;

    const ws = new WebSocket(`${WS_URL}?sessionId=${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus('connected');
      ws.send(JSON.stringify({ type: 'request-snapshot' }));
    };

    ws.onmessage = (message) => {
      const event = JSON.parse(message.data);

      switch (event.type) {
        case 'user-joined':
          toast(`${event.userName} joined`);
          setMessages((prev) => [...prev.slice(-19), event]);
          break;

        case 'user-left':
          toast(`${event.userName} left`);
          setMessages((prev) => [...prev.slice(-19), event]);
          break;

        default:
          setMessages((prev) => [...prev.slice(-19), event]);
          break;
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
    };

    ws.onerror = () => ws.close();
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