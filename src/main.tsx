
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element and render the App
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

console.log("Main rendering - initializing application");

const root = createRoot(rootElement);

// Render without StrictMode to prevent double mounting/unmounting in development
root.render(<App />);
