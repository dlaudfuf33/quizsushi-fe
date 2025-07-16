import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, StompSubscription } from "@stomp/stompjs";

/**
 * 범용 STOMP WebSocket 연결 훅
 *
 * @param topicPath - 구독할 /topic/{topicPath} 경로 (예: "challenge/세션ID", "leaderboard")
 * @param onMessageReceived - 메시지 수신 시 실행되는 콜백
 */
export function useSocketConnection(
  topicPath: string,
  onMessageReceived: (message: any) => void,
  options?: {
    connectHeaders?: Record<string, string>;
  }
) {
  const stompClient = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [connectHeaders, setConnectHeaders] = useState<Record<string, string>>(
    {}
  );
  const connect = useCallback(() => {
    const baseURL = process.env.NEXT_PUBLIC_URL;
    const socket = new SockJS(baseURL + "ws/challenge");

    const client = new Client({
      webSocketFactory: () => socket as WebSocket,
      connectHeaders,
      reconnectDelay: 3000,
      onConnect: () => {
        setIsConnected(true);
        subscribeToTopic(client, topicPath);
        setCurrentTopic(topicPath);
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket Error:", event);
      },
      onDisconnect: () => {
        setIsConnected(false);
        subscriptionRef.current?.unsubscribe();
        subscriptionRef.current = null;
      },
    });

    stompClient.current = client;
    client.activate();
  }, [topicPath]);

  const subscribeToTopic = (client: Client, topic: string) => {
    if (!client.connected) return;

    // 이전 구독 해제
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = client.subscribe(`/topic/${topic}`, (message) => {
      const payload = JSON.parse(message.body);
      onMessageReceived(payload);
    });
  };

  const send = (destination: string, body: any) => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: `/app/${destination}`,
        body: JSON.stringify(body),
      });
    }
  };

  const disconnect = useCallback(() => {
    if (stompClient.current?.connected) {
      stompClient.current.deactivate();
      stompClient.current = null;
    }
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
    setIsConnected(false);
  }, []);

  // topicPath 바뀌면 재연결
  useEffect(() => {
    if (!topicPath || topicPath === currentTopic) return;

    disconnect();
    setTimeout(() => {
      connect();
    }, 200);
  }, [topicPath, connect, disconnect, currentTopic]);

  return {
    connect,
    send,
    disconnect,
    isConnected,
    setConnectHeaders,
  };
}
