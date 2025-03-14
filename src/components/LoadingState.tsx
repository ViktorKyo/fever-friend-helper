
import React from 'react';
import Layout from '@/components/Layout';
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading application data..." }) => {
  return (
    <Layout>
      <div className="space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
          <p className="text-muted-foreground mt-1">Guidance for parents when fever strikes</p>
        </header>
        
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6">
          <div className="animate-pulse flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </Layout>
  );
};

export default LoadingState;
