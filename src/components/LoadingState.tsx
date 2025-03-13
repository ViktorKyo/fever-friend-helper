
import React from 'react';
import Layout from '@/components/Layout';

const LoadingState: React.FC = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground animate-pulse">Loading application data...</p>
      </div>
    </Layout>
  );
};

export default LoadingState;
