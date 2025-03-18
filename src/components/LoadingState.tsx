
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading application data..." }) => {
  console.log('LoadingState rendering with message:', message);
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 container max-w-screen-md mx-auto px-4 pb-24 pt-8 md:pt-12">
        <div className="space-y-6">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
            <p className="text-muted-foreground mt-1">Guidance for parents when fever strikes</p>
          </header>
          
          <div className="flex flex-col items-center justify-center min-h-[20vh] space-y-6 border border-red-200 p-4 rounded">
            <div className="animate-pulse flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-xs text-muted-foreground">(Loading component active)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
