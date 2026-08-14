import { createContext, useContext, useEffect, useCallback, useRef, useState } from "react";
import {
  connectSocket,
  disconnectSocket,
  emit as socketEmit,
  on as socketOn,
  off as socketOff,
  isConnected,
} from "../services/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(undefined);

function getAccessToken() {
  return sessionStorage.getItem("ak_access_token") || localStorage.getItem("ak_access_token");
}

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const { user } = useAuth();

  const connect = useCallback((token) => {
    if (!token) return;

    const socket = connectSocket(token);
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", (err) => {
      if (err?.message?.includes("Authentication")) {
        const freshToken = getAccessToken();
        if (freshToken && freshToken !== token) connect(freshToken);
      }
    });

    if (socket.connected) {
      setConnected(true);
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
    socketRef.current = null;
    setConnected(false);
  }, []);

  const emit = useCallback((event, data) => {
    return socketEmit(event, data);
  }, []);

  const on = useCallback((event, callback) => {
    return socketOn(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    socketOff(event, callback);
  }, []);

  useEffect(() => {
    if (!user) {
      disconnect();
      return;
    }
    connect(getAccessToken());

    return () => {
      disconnectSocket();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user, connect, disconnect]);

  return (
    <SocketContext.Provider
      value={{
        connected,
        isConnected: isConnected(),
        connect,
        disconnect,
        emit,
        on,
        off,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocket doit être utilisé dans un SocketProvider");
  }

  return context;
}