
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="p-4 mt-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
      <AlertCircle className="h-5 w-5" />
      <p>{error}</p>
    </div>
  );
};

export default ErrorDisplay;
