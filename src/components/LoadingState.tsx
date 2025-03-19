
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
  
  const loadingContent = (
    <div className={`flex flex-col items-center justify-center space-y-4 p-6 bg-white rounded-lg shadow-sm ${inline ? 'min-h-[200px]' : 'min-h-[400px]'} w-full`}>
      <div className="animate-pulse flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  );

  if (inline) {
    return loadingContent;
  }

  return (
    <div className="bg-background text-foreground w-full min-h-[80vh] flex flex-col justify-center">
      <div className="container max-w-screen-md mx-auto px-4 pb-12 pt-8 flex-1 flex flex-col justify-center">
        <div className="space-y-8 w-full">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
            <p className="text-muted-foreground mt-1">Guidance for parents when fever strikes</p>
          </header>
          
          {loadingContent}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
