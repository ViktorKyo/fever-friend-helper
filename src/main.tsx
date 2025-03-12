
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

console.log("Main rendering - initializing application with stable configuration");

// Create root without StrictMode to prevent double mounting/unmounting in development
const root = createRoot(rootElement);

// Error boundary for the entire application
const renderApp = () => {
  try {
    root.render(<App />);
    console.log("App successfully rendered");
  } catch (error) {
    console.error("Fatal error rendering app:", error);
    
    // Render fallback UI in case of catastrophic error
    root.render(
      <div className="error-container p-8 max-w-md mx-auto mt-12 bg-red-50 border border-red-200 rounded-md text-red-900">
        <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
        <p>The application failed to load. Please refresh the page and try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Refresh Page
        </button>
      </div>
    );
  }
};

renderApp();
