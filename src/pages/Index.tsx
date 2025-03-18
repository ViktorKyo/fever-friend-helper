
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
  const [isLoading, setIsLoading] = useState(true);
  
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
      // Short timeout to ensure DOM updates
      const timer = setTimeout(() => {
        setIsLoading(false);
        console.log('Index finished loading');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isProfilesLoaded]);

  // Debug logs
  useEffect(() => {
    console.log('Index rendering with state:', {
      isLoading,
      isProfilesLoaded,
      profilesLength: profiles?.length || 0,
      selectedProfileId,
      hasSelectedProfile: !!selectedProfile,
      hasError: !!error,
      temperatureReadings: profileTemperatures?.length || 0,
      currentTemperature: !!currentTemperature,
      visibleState: isLoading ? 'loading' : 'content',
    });
  }, [isLoading, isProfilesLoaded, profiles, selectedProfileId, selectedProfile, error, profileTemperatures, currentTemperature]);
  
  // Show loading state
  if (isLoading) {
    return <LoadingState message="Loading profile data..." />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
          <p className="text-muted-foreground mt-1">Guidance for parents when fever strikes</p>
        </header>
        
        {error && <ErrorDisplay error={error} />}
        
        <div className="content-container bg-gray-50 p-6 rounded-lg">
          {profiles && profiles.length > 0 ? (
            <>
              <div className="profile-section mb-6 bg-white p-4 rounded-lg shadow-sm">
                <ProfileSection 
                  profiles={profiles}
                  selectedProfileId={selectedProfileId || ''}
                  onProfileSelect={handleProfileSelect}
                  onProfileAdd={handleProfileAdd}
                />
              </div>
              
              {selectedProfile && (
                <div className="main-content-section">
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
            <div className="empty-state-container bg-white p-6 rounded-lg shadow-sm">
              <EmptyProfileState onCreateDefaultProfile={createNewDefaultProfile} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
