
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import Advice from "./pages/Advice";
import NotFound from "./pages/NotFound";
import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";

// Create a stable query client instance that won't change on rerenders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="app-container flex flex-col min-h-screen w-full bg-background">
            <ErrorBoundary fullPage>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/history" element={<History />} />
                <Route path="/advice" element={<Advice />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </ErrorBoundary>
            
            {/* Toast components for notifications */}
            <Toaster />
            <Sonner />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
