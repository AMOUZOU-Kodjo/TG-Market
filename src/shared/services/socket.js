import { io } from "socket.io-client";
import { SOCKET_URL } from "../constants";

let socket = null;
const listeners = new Map();

export function getSocket() {
  return socket;
}

export function connectSocket(token) {
  if (socket?.connected) return socket;

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30000,
    timeout: 20000,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connecté:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Déconnecté:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Erreur de connexion:", error.message);
  });

  socket.on("reconnect", (attempt) => {
    console.log("[Socket] Reconnecté après", attempt, "tentatives");
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log("[Socket] Tentative de reconnexion:", attempt);
  });

  socket.on("reconnect_error", (error) => {
    console.error("[Socket] Erreur de reconnexion:", error.message);
  });

  socket.on("reconnect_failed", () => {
    console.error("[Socket] Échec de la reconnexion");
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    listeners.clear();
  }
}

export function emit(event, data) {
  if (socket?.connected) {
    socket.emit(event, data);
    return true;
  }
  console.warn("[Socket] Impossible d'émettre:", event, "- Non connecté");
  return false;
}

export function on(event, callback) {
  if (!socket) return () => {};

  socket.on(event, callback);

  const key = `${event}:${callback.toString().slice(0, 50)}`;
  listeners.set(key, { event, callback });

  return () => {
    socket.off(event, callback);
    listeners.delete(key);
  };
}

export function off(event, callback) {
  if (!socket) return;
  socket.off(event, callback);
}

export function joinRoom(room) {
  return emit("join_room", { room });
}

export function leaveRoom(room) {
  return emit("leave_room", { room });
}

export function sendMessage(conversationId, content) {
  return emit("send_message", { conversationId, content });
}

export function startTyping(conversationId) {
  return emit("typing_start", { conversationId });
}

export function stopTyping(conversationId) {
  return emit("typing_stop", { conversationId });
}

export function markNotificationRead(notificationId) {
  return emit("notification_read", { notificationId });
}

export function markAllNotificationsRead() {
  return emit("notifications_read_all");
}

export function deleteMessage(messageId, scope = "me") {
  return emit("delete_message", { messageId, scope });
}

export function isConnected() {
  return socket?.connected ?? false;
}
