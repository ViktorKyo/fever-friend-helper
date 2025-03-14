
import React from 'react';
import TemperatureInput from '@/components/TemperatureInput';
import AdviceDisplay from '@/components/AdviceDisplay';
import TemperatureHistory from '@/components/TemperatureHistory';
import SymptomTracker from '@/components/SymptomTracker';
import { ChildProfile as ChildProfileType, Temperature, TemperatureReading } from '@/lib/feverGuide';

interface MainContentProps {
  profile: ChildProfileType;
  currentTemperature: Temperature | null;
  profileTemperatures: TemperatureReading[];
  onTemperatureSubmit: (temperature: Temperature) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  profile,
  currentTemperature,
  profileTemperatures,
  onTemperatureSubmit
}) => {
  const hasTemperatures = Array.isArray(profileTemperatures) && profileTemperatures.length > 0;
  
  return (
    <div className="space-y-6">
      <TemperatureInput onSubmit={onTemperatureSubmit} />
      
      {currentTemperature && (
        <AdviceDisplay 
          temperature={currentTemperature}
          childProfile={profile}
        />
      )}
      
      {hasTemperatures && (
        <>
          <SymptomTracker 
            childProfile={profile}
            readings={profileTemperatures}
          />
          
          <TemperatureHistory
            readings={profileTemperatures}
            childProfile={profile}
            limit={3}
          />
        </>
      )}
    </div>
  );
};

export default MainContent;
