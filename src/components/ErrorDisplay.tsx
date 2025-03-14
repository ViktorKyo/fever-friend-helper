
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: string;
  retry?: () => void;
  fullPage?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, retry, fullPage = false }) => {
  // Force error to string and truncate if too long
  const errorMessage = typeof error === 'string' ? error : 'An unexpected error occurred';
  const displayError = errorMessage.length > 200 ? `${errorMessage.substring(0, 200)}...` : errorMessage;

  const errorContent = (
    <div className="p-6 my-6 bg-destructive/10 text-destructive rounded-md flex flex-col items-center gap-4 border border-destructive">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-6 w-6" />
        <h3 className="font-semibold text-lg">Error Detected</h3>
      </div>
      
      <p className="text-center">{displayError}</p>
      
      {retry && (
        <Button 
          variant="outline" 
          className="mt-2 border-destructive text-destructive hover:bg-destructive/10"
          onClick={retry}
        >
          Try Again
        </Button>
      )}
      
      <div className="w-full pt-3 border-t border-destructive/30 text-xs text-center text-muted-foreground">
        If this error persists, try refreshing the page or clearing your browser cache.
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="flex-1 container max-w-screen-md mx-auto px-4 pb-24 pt-8 md:pt-12">
          <div className="space-y-6">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
              <p className="text-muted-foreground mt-1">Guidance for parents when fever strikes</p>
            </header>
            {errorContent}
          </div>
        </div>
      </div>
    );
  }

  return errorContent;
};

export default ErrorDisplay;
