import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

const RELEASE_CACHE_KEY = "little-ears-release-20260710-tiny-mobile";
const RELOAD_SESSION_KEY = "little-ears-tiny-mobile-reloaded";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

async function clearLegacyServiceWorkers() {
  const appScope = new URL(import.meta.env.BASE_URL, window.location.origin).href;
  const registrations = await navigator.serviceWorker.getRegistrations();

  await Promise.all(
    registrations.map((registration) => {
      const isLittleEarsScope = registration.scope.includes("/little-ears-storybox/");
      if (isLittleEarsScope && registration.scope !== appScope) {
        return registration.unregister();
      }
      return Promise.resolve(false);
    })
  );

  if ("caches" in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(
      cacheKeys
        .filter((key) => key.startsWith("little-ears-storybox"))
        .map((key) => caches.delete(key))
    );
  }
}

function registerAppServiceWorker() {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then((registration) => {
    registration.update().catch(() => {
      // Updating is best-effort; loading still works without it.
    });
  }).catch(() => {
    // The app still works online if service worker registration is unavailable.
  });
}

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

    if (localStorage.getItem(RELEASE_CACHE_KEY) !== "done" && !sessionStorage.getItem(RELOAD_SESSION_KEY)) {
      sessionStorage.setItem(RELOAD_SESSION_KEY, "1");
      clearLegacyServiceWorkers()
        .then(() => {
          localStorage.setItem(RELEASE_CACHE_KEY, "done");
          window.location.reload();
        })
        .catch(() => {
          localStorage.setItem(RELEASE_CACHE_KEY, "done");
          window.location.reload();
        });
      return;
    }

    registerAppServiceWorker();
  });
}
