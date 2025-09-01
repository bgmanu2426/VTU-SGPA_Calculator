"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered ✅", registration);
        })
        .catch((err) => {
          console.error("SW registration failed ❌", err);
        });
    }
  }, []);

  return null;
}
