
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useProfiles } from '@/hooks/useProfiles';
import { useTemperatures } from '@/hooks/useTemperatures';
import LoadingState from '@/components/LoadingState';
import EmptyProfileState from '@/components/EmptyProfileState';
import ErrorDisplay from '@/components/ErrorDisplay';
import ProfileSection from '@/components/ProfileSection';
import MainContent from '@/components/MainContent';

const Index = () => {
  // Force rerender after a small delay to ensure hooks are initialized properly
  const [forceRender, setForceRender] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceRender(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Use our custom hooks for state management
  const {
    profiles,
    selectedProfileId,
    isLoaded: isProfilesLoaded,
    error: profileError,
    selectedProfile,
    handleProfileAdd,
    handleProfileSelect,
    createNewDefaultProfile
  } = useProfiles();
  
  const {
    currentTemperature,
    error: temperatureError,
    profileTemperatures,
    handleTemperatureSubmit
  } = useTemperatures(selectedProfileId, isProfilesLoaded);

  // Combine errors for display
  const error = profileError || temperatureError;
  
  // Debug logs
  useEffect(() => {
    console.log('Index rendering with state:', {
      forceRender,
      isProfilesLoaded,
      profilesLength: profiles?.length || 0,
      selectedProfileId,
      hasSelectedProfile: !!selectedProfile,
      hasError: !!error,
      temperatureReadings: profileTemperatures?.length || 0
    });
  }, [forceRender, isProfilesLoaded, profiles, selectedProfileId, selectedProfile, error, profileTemperatures]);
  
  // Show loading state until data is loaded
  if (!isProfilesLoaded) {
    return <LoadingState />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
          <p className="text-muted-foreground mt-1">Guidance for parents when fever strikes</p>
        </header>
        
        {profiles && profiles.length > 0 ? (
          <>
            <ProfileSection 
              profiles={profiles}
              selectedProfileId={selectedProfileId || ''}
              onProfileSelect={handleProfileSelect}
              onProfileAdd={handleProfileAdd}
            />
            
            {selectedProfile && (
              <MainContent
                profile={selectedProfile}
                currentTemperature={currentTemperature}
                profileTemperatures={profileTemperatures || []}
                onTemperatureSubmit={handleTemperatureSubmit}
              />
            )}
          </>
        ) : (
          <EmptyProfileState onCreateDefaultProfile={createNewDefaultProfile} />
        )}
        
        {error && <ErrorDisplay error={error} />}
      </div>
    </Layout>
  );
};

export default Index;
