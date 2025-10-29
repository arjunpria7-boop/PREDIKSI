
// FIX: Import React and ReactDOM to provide types for TypeScript.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// React and ReactDOM are now loaded globally from index.html via CDN scripts.
// We no longer import them here to avoid conflicts.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Use the global ReactDOM object provided by the CDN script.
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);