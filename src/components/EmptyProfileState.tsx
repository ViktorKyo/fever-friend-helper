
import React from 'react';
import { Button } from "@/components/ui/button";

interface EmptyProfileStateProps {
  onCreateDefaultProfile: () => void;
}

const EmptyProfileState: React.FC<EmptyProfileStateProps> = ({ onCreateDefaultProfile }) => {
  return (
    <div className="text-center p-8 border border-dashed rounded-lg">
      <p>No profiles found. Please add a child profile to get started.</p>
      <Button 
        onClick={onCreateDefaultProfile}
        className="mt-4"
      >
        Create Default Profile
      </Button>
    </div>
  );
};

export default EmptyProfileState;
