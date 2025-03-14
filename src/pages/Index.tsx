
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
  const [renderAttempt, setRenderAttempt] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Use a more robust mechanism to ensure rendering
  useEffect(() => {
    console.log("Index page initialize, attempt:", renderAttempt);
    
    const timer = setTimeout(() => {
      setIsInitializing(false);
      
      // If we still have issues, try one more rerender after a longer delay
      if (renderAttempt < 2) {
        const secondTimer = setTimeout(() => {
          setRenderAttempt(prev => prev + 1);
          console.log("Forcing additional render, attempt:", renderAttempt + 1);
        }, 300 * (renderAttempt + 1));
        
        return () => clearTimeout(secondTimer);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [renderAttempt]);
  
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
      renderAttempt,
      isInitializing,
      isProfilesLoaded,
      profilesLength: profiles?.length || 0,
      selectedProfileId,
      hasSelectedProfile: !!selectedProfile,
      hasError: !!error,
      temperatureReadings: profileTemperatures?.length || 0,
      currentTemperature: !!currentTemperature,
    });
  }, [renderAttempt, isInitializing, isProfilesLoaded, profiles, selectedProfileId, selectedProfile, error, profileTemperatures, currentTemperature]);
  
  // Show loading state until data is loaded
  if (isInitializing || !isProfilesLoaded) {
    return <LoadingState message={isInitializing ? "Initializing..." : "Loading profile data..."} />;
  }

  // Create a safe rendering component to avoid null/undefined errors
  const renderMainContent = () => {
    if (!selectedProfile) {
      return <ErrorDisplay error="No profile selected. Please select or create a profile." />;
    }
    
    return (
      <MainContent
        profile={selectedProfile}
        currentTemperature={currentTemperature}
        profileTemperatures={profileTemperatures || []}
        onTemperatureSubmit={handleTemperatureSubmit}
      />
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
          <p className="text-muted-foreground mt-1">Guidance for parents when fever strikes</p>
        </header>
        
        {error && <ErrorDisplay error={error} />}
        
        {profiles && profiles.length > 0 ? (
          <>
            <ProfileSection 
              profiles={profiles}
              selectedProfileId={selectedProfileId || ''}
              onProfileSelect={handleProfileSelect}
              onProfileAdd={handleProfileAdd}
            />
            
            {selectedProfile && renderMainContent()}
          </>
        ) : (
          <EmptyProfileState onCreateDefaultProfile={createNewDefaultProfile} />
        )}
      </div>
    </Layout>
  );
};

export default Index;
