(function () {
  "use strict";

  // 1. Get configuration from the script tag attributes
  const scriptTag = document.currentScript;
  const writeKey = scriptTag.getAttribute("data-write-key");
  // Default to the current domain's API if not specified (useful for self-hosting)
  const endpoint = scriptTag.getAttribute("data-endpoint") || "http://localhost:3000/api/v1/ingest";

  if (!writeKey) {
    console.error("Observo: Missing data-write-key attribute.");
    return;
  }

  // 2. Helper to send events
  function sendEvent(type, payload = {}) {
    // Basic browser data
    const data = {
      write_key: writeKey,
      type: type,
      payload: {
        ...payload,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        width: window.screen.width,
        language: navigator.language,
        user_agent: navigator.userAgent, 
      },
    };

    // Use beacon if available (better for page unload), fallback to fetch
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch((err) => console.error("Observo Error:", err));
    }
  }

  // 3. Auto-track Page Views
  // Track initial load
  sendEvent("page_view");

  // Track History API changes (SPA navigation like Next.js/React)
  const originalPushState = history.pushState;
  history.pushState = function () {
    originalPushState.apply(this, arguments);
    sendEvent("page_view");
  };
//   7.1️⃣ history.pushState — what is it?
// What browsers normally do

// When a SPA navigates:

// history.pushState({}, "", "/pricing");


// This:

// Changes the URL

// Does NOT reload the page

// React Router, Next.js, Vue Router all use this internally.

// Why we override it

// Original behavior:

// URL changes

// ❌ Analytics knows nothing

// We do this instead 👇

// const originalPushState = history.pushState;


// 📌 Save the original browser function so we don’t break it.

// Overriding it
// history.pushState = function () {
//   originalPushState.apply(this, arguments);
//   sendEvent("page_view");
// };

// What this REALLY means (plain English):

// “Whenever the app changes the URL,
// first do the normal browser behavior,
// then send a page_view event.”

  window.addEventListener("popstate", () => {
    sendEvent("page_view");
  });
  // 7.2️⃣ popstate — Back / Forward buttons
// What popstate is

// It fires when:

// User clicks browser Back

// User clicks browser Forward

// window.addEventListener("popstate", () => {
//   sendEvent("page_view");
// });

// Why this is needed

// Without this:

// Back button changes page

// ❌ No page view recorded

// With this:

// Back / Forward = new page view

// Analytics stays accurate

  // 4. Expose global function for custom events
  window.observo = {
    track: (type, payload) => sendEvent(type, payload),
  };
})();