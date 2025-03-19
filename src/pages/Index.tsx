
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
    // Only show initial loading state briefly
    if (isProfilesLoaded) {
      // Set a brief timeout to allow data to load
      const timer = setTimeout(() => {
        setIsLoadingInitial(false);
        console.log('Index finished loading - showing content');
      }, 300); // Increased timeout for better data loading
      return () => clearTimeout(timer);
    }
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
  
  // Show loading state only for the initial load
  if (isLoadingInitial) {
    return <LoadingState message="Loading your data..." />;
  }

  return (
    <Layout>
      <div className="space-y-8 w-full flex-1 flex flex-col min-h-[80vh]">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
          <p className="text-muted-foreground mt-2">Guidance for parents when fever strikes</p>
        </header>
        
        {error && <ErrorDisplay error={error} />}
        
        <div className="content-container bg-gray-50 p-6 rounded-lg shadow-sm w-full flex-1 flex flex-col">
          {profiles && profiles.length > 0 ? (
            <>
              <div className="profile-section mb-8 bg-white p-6 rounded-lg shadow-sm w-full">
                <ProfileSection 
                  profiles={profiles}
                  selectedProfileId={selectedProfileId || ''}
                  onProfileSelect={handleProfileSelect}
                  onProfileAdd={handleProfileAdd}
                />
              </div>
              
              {selectedProfile && (
                <div className="main-content-section w-full flex-1 flex flex-col">
                  <MainContent
                    profile={selectedProfile}
                    currentTemperature={currentTemperature}
                    profileTemperatures={profileTemperatures || []}
                    onTemperatureSubmit={handleTemperatureSubmit}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="empty-state-container bg-white p-8 rounded-lg shadow-sm w-full flex-1 flex items-center justify-center">
              <EmptyProfileState onCreateDefaultProfile={createNewDefaultProfile} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
