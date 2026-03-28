import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../api/axios';

const useOrderTracking = (orderId) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let stompClient = null;

    // 1. Fetch initial state via REST
    const fetchInitialData = async () => {
      try {
        const res = await api.get(`/${orderId}`);
        setTrackingData(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
           setError("Tracking information not found for this order.");
        } else {
           setError(err.response?.data?.error || "Failed to fetch tracking data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // 2. Setup WebSocket connection for live updates
    const connectWebSocket = () => {
      const socketUrl = 'http://localhost:8086/ws';
      
      stompClient = new Client({
        webSocketFactory: () => new SockJS(socketUrl),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setConnected(true);
          console.log('Connected to STOMP WebSocket');
          // Subscribe to topic unique to this orderId
          stompClient.subscribe(`/topic/tracking/${orderId}`, (message) => {
            if (message.body) {
              const updatedData = JSON.parse(message.body);
              setTrackingData(updatedData);
            }
          });
        },
        onStompError: (frame) => {
          console.error('STOMP Error:', frame.headers['message']);
          setConnected(false);
        },
        onWebSocketClose: () => {
          setConnected(false);
        }
      });

      stompClient.activate();
    };

    connectWebSocket();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [orderId]);

  return { trackingData, loading, error, connected };
};

export default useOrderTracking;
