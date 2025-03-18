
import React from 'react';
import TemperatureInput from '@/components/TemperatureInput';
import AdviceDisplay from '@/components/AdviceDisplay';
import TemperatureHistory from '@/components/TemperatureHistory';
import SymptomTracker from '@/components/SymptomTracker';
import { ChildProfile as ChildProfileType, Temperature, TemperatureReading } from '@/lib/feverGuide';
import LoadingState from './LoadingState';

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
  
  if (!profile) {
    return <LoadingState inline message="Waiting for profile data..." />;
  }
  
  return (
    <div className="space-y-6">
      <div className="temperature-input-section bg-white border p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-3">Record Temperature</h2>
        <TemperatureInput onSubmit={onTemperatureSubmit} />
      </div>
      
      {currentTemperature && (
        <div className="advice-section bg-white border p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-3">Fever Advice</h2>
          <AdviceDisplay 
            temperature={currentTemperature}
            childProfile={profile}
          />
        </div>
      )}
      
      {hasTemperatures && (
        <>
          <div className="symptom-tracker-section bg-white border p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-3">Symptom Tracker</h2>
            <SymptomTracker 
              childProfile={profile}
              readings={profileTemperatures}
            />
          </div>
          
          <div className="temperature-history-section bg-white border p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-3">Recent Readings</h2>
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
