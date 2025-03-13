
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element only once
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Fatal: Root element not found');
}

// Create the root only once
const root = createRoot(rootElement);

// Render the app with StrictMode to catch potential issues
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Handle unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});
