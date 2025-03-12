
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import History from "./pages/History";
import Advice from "./pages/Advice";
import NotFound from "./pages/NotFound";

// Create a client with stable configuration that won't cause re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 500,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      gcTime: Infinity, // Prevent garbage collection
    },
  },
});

const App = () => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    console.log("App initializing...");
    // This ensures the app has a chance to fully initialize before rendering routes
    setTimeout(() => {
      console.log("App ready");
      setIsReady(true);
    }, 100);
  }, []);
  
  // If app isn't ready yet, render a minimal loading state
  if (!isReady) {
    return (
      <div className="app-container flex flex-col min-h-screen w-full bg-background items-center justify-center">
        <div className="text-center p-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Fever Friend</h1>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="app-container flex flex-col min-h-screen w-full bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/history" element={<History />} />
              <Route path="/advice" element={<Advice />} />
              <Route path="/404" element={<NotFound />} />
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
