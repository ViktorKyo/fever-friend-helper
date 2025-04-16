
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
    return <LoadingState inline message="Loading profile data..." />;
  }
  
  return (
    <div className="space-y-6 w-full mb-16">
      <section className="bg-white border rounded-lg shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4">Record Temperature</h2>
        <TemperatureInput onSubmit={onTemperatureSubmit} />
      </section>
      
      {currentTemperature && (
        <section className="bg-white border rounded-lg shadow-md p-5">
          <h2 className="text-xl font-semibold mb-4">Fever Advice</h2>
          <AdviceDisplay 
            temperature={currentTemperature}
            childProfile={profile}
          />
        </section>
      )}
      
      {hasTemperatures && (
        <>
          <section className="bg-white border rounded-lg shadow-md p-5">
            <h2 className="text-xl font-semibold mb-4">Symptom Tracker</h2>
            <SymptomTracker 
              childProfile={profile}
              readings={profileTemperatures}
            />
          </section>
          
          <section className="bg-white border rounded-lg shadow-md p-5 mb-8">
            <h2 className="text-xl font-semibold mb-4">Recent Readings</h2>
            <TemperatureHistory
              readings={profileTemperatures}
              childProfile={profile}
              limit={3}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default MainContent;
