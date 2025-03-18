
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
  
  console.log('MainContent rendering with:', {
    hasProfile: !!profile,
    profileName: profile?.name,
    hasCurrentTemp: !!currentTemperature,
    currentTemp: currentTemperature?.value,
    hasTemperatures,
    temperatureCount: profileTemperatures?.length
  });
  
  return (
    <div className="space-y-6">
      <div className="temperature-input-section border border-blue-100 p-2 rounded">
        <TemperatureInput onSubmit={onTemperatureSubmit} />
      </div>
      
      {currentTemperature && (
        <div className="advice-section border border-green-100 p-2 rounded">
          <AdviceDisplay 
            temperature={currentTemperature}
            childProfile={profile}
          />
        </div>
      )}
      
      {hasTemperatures && (
        <>
          <div className="symptom-tracker-section border border-orange-100 p-2 rounded">
            <SymptomTracker 
              childProfile={profile}
              readings={profileTemperatures}
            />
          </div>
          
          <div className="temperature-history-section border border-purple-100 p-2 rounded">
            <TemperatureHistory
              readings={profileTemperatures}
              childProfile={profile}
              limit={3}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MainContent;
