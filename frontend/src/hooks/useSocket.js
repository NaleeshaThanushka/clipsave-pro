import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * Manages the socket connection and the live queue/history state derived
 * from `queued`, `progress`, `completed`, `failed` events.
 */
export default function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [queue, setQueue] = useState([]); // Map-like array of items keyed by id
  const [history, setHistory] = useState([]);

  const upsertItem = useCallback((incoming) => {
    setQueue((prev) => {
      const idx = prev.findIndex((i) => i.id === incoming.id);
      if (idx === -1) return [incoming, ...prev];
      const next = [...prev];
      next[idx] = { ...next[idx], ...incoming };
      return next;
    });
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('queue:snapshot', (items) => {
      setQueue(items);
    });

    socket.on('queued', upsertItem);
    socket.on('progress', upsertItem);

    socket.on('completed', (item) => {
      upsertItem(item);
      setHistory((prev) => [item, ...prev]);
    });

    socket.on('failed', upsertItem);

    return () => {
      socket.disconnect();
    };
  }, [upsertItem]);

  return { connected, queue, history, setHistory };
}