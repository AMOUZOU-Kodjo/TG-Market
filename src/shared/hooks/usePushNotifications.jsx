/* global Notification */
import { useEffect, useRef } from "react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { pushApi } from "@/features/push/services/push.api";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationsSubscriber() {
  const { user, isAuthenticated } = useAuth();
  const handledRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (handledRef.current) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    handledRef.current = true;

    const run = async () => {
      try {
        const { enabled, publicKey } = await pushApi.getConfig();
        if (!enabled || !publicKey) return;

        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }
        if (permission !== "granted") return;

        const reg = await navigator.serviceWorker.ready;
        let subscription = await reg.pushManager.getSubscription();
        if (!subscription) {
          subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          });
        }
        if (subscription) {
          await pushApi.subscribe(subscription.toJSON());
        }
      } catch {
        // Silencieux : le push est un bonus, jamais bloquant
      }
    };
    run();
  }, [isAuthenticated, user]);

  return null;
}