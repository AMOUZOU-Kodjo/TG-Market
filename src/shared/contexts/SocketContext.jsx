import { createContext, useContext, useEffect, useCallback, useRef, useState } from "react";
import {
  connectSocket,
  disconnectSocket,
  emit as socketEmit,
  on as socketOn,
  off as socketOff,
  isConnected,
} from "../services/socket";

const SocketContext = createContext(undefined);

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  const connect = useCallback((token) => {
    if (!token) return;

    const socket = connectSocket(token);
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

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
    const token = localStorage.getItem("ak_access_token");
    if (token) connect(token);

    return () => {
      disconnectSocket();
      socketRef.current = null;
      setConnected(false);
    };
  }, [connect]);

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