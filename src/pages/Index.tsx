
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
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
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
  
  // Set loading state
  useEffect(() => {
    console.log('Index mounting', { isProfilesLoaded });
    if (isProfilesLoaded) {
      // Directly set to loaded after a very short delay
      setTimeout(() => {
        setIsLoadingInitial(false);
        console.log('Index finished loading - showing content');
      }, 500);
    }
    
    return () => {
      console.log('Index unmounting');
    };
  }, [isProfilesLoaded]);

  // Debug logs
  console.log('Index rendering with state:', {
    isLoadingInitial,
    isProfilesLoaded,
    profilesLength: profiles?.length || 0,
    selectedProfileId,
    hasSelectedProfile: !!selectedProfile,
    hasError: !!error,
    temperatureReadings: profileTemperatures?.length || 0,
    currentTemperature: !!currentTemperature,
  });
  
  // Show full-page loading state only for the initial load
  if (isLoadingInitial) {
    return <LoadingState message="Loading your data..." />;
  }

  return (
    <Layout>
      <div className="w-full">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
          <p className="text-muted-foreground mt-2">Guidance for parents when fever strikes</p>
        </header>
        
        {error && <ErrorDisplay error={error} />}
        
        {profiles && profiles.length > 0 ? (
          <>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
              <ProfileSection 
                profiles={profiles}
                selectedProfileId={selectedProfileId || ''}
                onProfileSelect={handleProfileSelect}
                onProfileAdd={handleProfileAdd}
              />
            </div>
            
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
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <EmptyProfileState onCreateDefaultProfile={createNewDefaultProfile} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
