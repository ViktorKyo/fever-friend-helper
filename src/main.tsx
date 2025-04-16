
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element and create root only once
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Fatal: Root element not found');
}

// Create a stable root for React
const root = createRoot(rootElement);

// Render the app once and for all
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Add React error reporting
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});
