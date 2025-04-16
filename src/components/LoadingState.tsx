
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  inline?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading application data...",
  inline = false
}) => {
  console.log('LoadingState rendering with message:', message, 'inline:', inline);
  
  if (inline) {
    return (
      <div className="bg-white rounded-lg shadow border p-8 flex flex-col items-center justify-center w-full" style={{ minHeight: '200px' }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-center">{message}</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md border p-8 w-full max-w-md flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
        <h2 className="text-xl font-semibold text-primary mb-2">Fever Friend</h2>
        <p className="text-muted-foreground text-center">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
