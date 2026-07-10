import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
      caches?.keys?.().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // The app still works online if service worker registration is unavailable.
    });
  });
}
