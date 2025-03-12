
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('Root element not found! App cannot be rendered.');
  throw new Error('Fatal: Root element not found');
}

console.log("Main rendering - initializing application");

// Create root and render immediately
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
console.log("App rendering started");

// Handle unhandled errors at the global level
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});
