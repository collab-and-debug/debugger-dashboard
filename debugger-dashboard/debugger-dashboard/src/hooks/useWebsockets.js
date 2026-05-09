import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const RECONNECT_DELAY = 3000;
const TOAST_DURATION_MS = 3500;

function resolveWebSocketUrl() {
  const explicitUrl = import.meta.env.VITE_WS_URL;
  if (explicitUrl) return explicitUrl;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (backendUrl) {
    const apiUrl = new URL(backendUrl);
    apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    return apiUrl.toString().replace(/\/$/, '');
  }

  const { protocol, host } = window.location;
  return `${protocol === 'https:' ? 'wss' : 'ws'}://${host}`;
}

function normalizedType(type) {
  return String(type || '').toLowerCase();
}

export default function useWebSocket(sessionId) {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  // Prevent reconnect loops from spamming user-facing toasts.
  const lastConnectionToastAtRef = useRef(0);
  const connectionToastCooldownMs = 10_000;

  const lastToastKeyRef = useRef(null);
  const lastToastAtRef = useRef(0);
  const dedupeWindowMs = 1200;

  const showToastDedupe = useCallback((toastKey, renderFn) => {
    const now = Date.now();
    if (lastToastKeyRef.current === toastKey && now - lastToastAtRef.current < dedupeWindowMs) {
      return;
    }
    lastToastKeyRef.current = toastKey;
    lastToastAtRef.current = now;

    toast(renderFn, {
      duration: TOAST_DURATION_MS,
      position: 'top-center',
    });
  }, []);

  const connect = useCallback(() => {
    const wsUrl = resolveWebSocketUrl();
    const ws = new WebSocket(`${wsUrl}?sessionId=${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus('connected');
      ws.send(JSON.stringify({ type: 'request-snapshot' }));

      const now = Date.now();
      if (now - lastConnectionToastAtRef.current > connectionToastCooldownMs) {
        lastConnectionToastAtRef.current = now;
        toast.success('Connected', { duration: TOAST_DURATION_MS, position: 'top-center' });
      }
    };

    ws.onmessage = (message) => {
      const event = JSON.parse(message.data);
      const type = normalizedType(event.type);

      // Maintain the chat/event feed (trimmed)
      setMessages((prev) => [...prev.slice(-19), event]);

      // Selective toasts for presence changes.
      if (type === 'user-joined') {
        const userName = event.userName || 'Someone';
        const toastKey = `presence:join:${userName}`;
        showToastDedupe(toastKey, `${userName} joined`);
      } else if (type === 'user-left') {
        const userName = event.userName || 'Someone';
        const toastKey = `presence:left:${userName}`;
        showToastDedupe(toastKey, `${userName} left`);
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');

      const now = Date.now();
      if (now - lastConnectionToastAtRef.current > connectionToastCooldownMs) {
        lastConnectionToastAtRef.current = now;
        toast.error('Disconnected. Reconnecting…', {
          duration: TOAST_DURATION_MS,
          position: 'top-center',
        });
      }

      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
    };

    ws.onerror = () => ws.close();
  }, [sessionId, showToastDedupe, connect]);

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

