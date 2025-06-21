import { useEffect, useRef, useState } from 'react';

interface SocketMessage {
  type: string;
  paintingId?: number;
  bid?: {
    id: number;
    bidderName: string;
    amount: string;
    timestamp: Date;
  };
  currentBid?: string;
}

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      setConnected(true);
      console.log('WebSocket connected');
    };
    
    socket.onclose = () => {
      setConnected(false);
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (socketRef.current?.readyState !== WebSocket.OPEN) {
          connect();
        }
      }, 3000);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    socket.onmessage = (event) => {
      try {
        const message: SocketMessage = JSON.parse(event.data);
        setLastMessage(message);
      } catch (error) {
        console.error('Error parsing socket message:', error);
      }
    };
    
    socketRef.current = socket;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setConnected(false);
    }
  };

  const joinRoom = (paintingId: number) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'joinRoom',
        paintingId
      }));
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return {
    connected,
    lastMessage,
    joinRoom,
    connect,
    disconnect
  };
}
