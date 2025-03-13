
import React from 'react';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="p-4 mt-4 bg-destructive/10 text-destructive rounded-md">
      <p>{error}</p>
    </div>
  );
};

export default ErrorDisplay;
