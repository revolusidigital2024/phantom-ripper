
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// FIX: Initialize process.env manually for browser context to ensure SDK has access.
// As per guidelines, the API key must be pre-configured and not retrieved from localStorage or UI.
(window as any).process = (window as any).process || { env: {} };
(window as any).process.env = (window as any).process.env || {};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
