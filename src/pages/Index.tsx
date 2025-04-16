
import React, { useEffect, useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { useProfiles } from '@/hooks/useProfiles';
import { useTemperatures } from '@/hooks/useTemperatures';
import LoadingState from '@/components/LoadingState';
import EmptyProfileState from '@/components/EmptyProfileState';
import ErrorDisplay from '@/components/ErrorDisplay';
import ProfileSection from '@/components/ProfileSection';
import MainContent from '@/components/MainContent';

const Index = () => {
  // Use a ref to track if component is mounted
  const isMounted = useRef(true);
  // Track initial load completion
  const initialLoadComplete = useRef(false);
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
  
  // Set loading state with a more reliable approach
  useEffect(() => {
    console.log('Index mounting with isProfilesLoaded:', isProfilesLoaded);
    
    // Only proceed if profiles are loaded and we haven't completed initial load
    if (isProfilesLoaded && !initialLoadComplete.current) {
      // Use shorter timeout to prevent perceived lag
      const timer = setTimeout(() => {
        if (isMounted.current) {
          console.log('Setting isLoadingInitial to false');
          setIsLoadingInitial(false);
          initialLoadComplete.current = true;
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
    // Cleanup function 
    return () => {
      console.log('Index effect cleanup');
      isMounted.current = false;
    };
  }, [isProfilesLoaded]);

  // Set isMounted to true when component mounts
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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
      <div className="flex flex-col w-full">
        <header className="text-center mb-6 mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
          <p className="text-muted-foreground mt-2">Guidance for parents when fever strikes</p>
        </header>
        
        {error && <ErrorDisplay error={error} />}
        
        {profiles && profiles.length > 0 ? (
          <>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 border">
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
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <EmptyProfileState onCreateDefaultProfile={createNewDefaultProfile} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
