
import React from 'react';
import Layout from '@/components/Layout';

const LoadingState: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <div className="animate-pulse h-4 w-32 bg-muted rounded"></div>
        <p className="text-muted-foreground">Loading application data...</p>
      </div>
    </Layout>
  );
};

export default LoadingState;
