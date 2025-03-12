
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Index from "./pages/Index";
import History from "./pages/History";
import Advice from "./pages/Advice";
import NotFound from "./pages/NotFound";

// Create a client with stable configuration that won't cause re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      gcTime: Infinity, // Prevent garbage collection
    },
  },
});

const App = () => {
  const [isReady, setIsReady] = useState(true); // Start ready by default
  const appInitialized = useRef(false);
  
  useEffect(() => {
    if (appInitialized.current) return;
    appInitialized.current = true;
    
    console.log("App initializing... (will render immediately)");
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="app-container flex flex-col min-h-screen w-full bg-background">
            <Routes>
              <Route path="/" element={<Index key="index-route" />} />
              <Route path="/history" element={<History key="history-route" />} />
              <Route path="/advice" element={<Advice key="advice-route" />} />
              <Route path="/404" element={<NotFound key="notfound-route" />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            
            {/* Toast components for notifications */}
            <Toaster />
            <Sonner />
          </div>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
