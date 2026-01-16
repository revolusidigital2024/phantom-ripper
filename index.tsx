
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Inisialisasi process.env secara manual buat browser
// Ini kunci biar error "An API Key must be set..." ilang
(window as any).process = (window as any).process || { env: {} };
(window as any).process.env = (window as any).process.env || {};
if (!(window as any).process.env.API_KEY) {
  (window as any).process.env.API_KEY = localStorage.getItem('phantom_api_key') || '';
}

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
