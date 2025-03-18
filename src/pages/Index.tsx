
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
  const [isInitializing, setIsInitializing] = useState(true);
  
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
  
  // Ensure we're done initializing after a short delay
  useEffect(() => {
    console.log('Index component mounting');
    const timer = setTimeout(() => {
      setIsInitializing(false);
      console.log('Index finished initializing');
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Debug logs
  useEffect(() => {
    console.log('Index rendering with state:', {
      isInitializing,
      isProfilesLoaded,
      profilesLength: profiles?.length || 0,
      selectedProfileId,
      hasSelectedProfile: !!selectedProfile,
      hasError: !!error,
      temperatureReadings: profileTemperatures?.length || 0,
      currentTemperature: !!currentTemperature,
      visibleState: !isInitializing && isProfilesLoaded ? 'should show content' : 'loading',
    });
  }, [isInitializing, isProfilesLoaded, profiles, selectedProfileId, selectedProfile, error, profileTemperatures, currentTemperature]);
  
  // Show loading state until data is loaded
  if (isInitializing || !isProfilesLoaded) {
    return <LoadingState message={isInitializing ? "Initializing..." : "Loading profile data..."} />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
          <p className="text-muted-foreground mt-1">Guidance for parents when fever strikes</p>
        </header>
        
        {error && <ErrorDisplay error={error} />}
        
        <div className="content-container border-2 border-blue-200 p-4 rounded-lg">
          <p className="text-center mb-4 text-blue-500">Content Debug Area</p>
          
          {profiles && profiles.length > 0 ? (
            <>
              <div className="profile-section mb-6 border border-green-200 p-2 rounded">
                <ProfileSection 
                  profiles={profiles}
                  selectedProfileId={selectedProfileId || ''}
                  onProfileSelect={handleProfileSelect}
                  onProfileAdd={handleProfileAdd}
                />
              </div>
              
              {selectedProfile && (
                <div className="main-content-section border border-purple-200 p-2 rounded">
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
            <div className="empty-state-container border border-yellow-200 p-2 rounded">
              <EmptyProfileState onCreateDefaultProfile={createNewDefaultProfile} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
