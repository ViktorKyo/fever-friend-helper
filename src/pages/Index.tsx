
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import ChildProfile from '@/components/ChildProfile';
import TemperatureInput from '@/components/TemperatureInput';
import AdviceDisplay from '@/components/AdviceDisplay';
import TemperatureHistory from '@/components/TemperatureHistory';
import SymptomTracker from '@/components/SymptomTracker';
import { 
  ChildProfile as ChildProfileType, 
  Temperature, 
  TemperatureReading, 
  generateMockReadings 
} from '@/lib/feverGuide';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

// Define a context object to store application state
const LOCAL_STORAGE_PROFILES_KEY = 'feverFriend_profiles';
const LOCAL_STORAGE_TEMPS_KEY = 'feverFriend_temperatures';

const Index = () => {
  console.log("Index page rendering");
  
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ChildProfileType[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [temperatures, setTemperatures] = useState<TemperatureReading[]>([]);
  const [currentTemperature, setCurrentTemperature] = useState<Temperature | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Force render control - prevent double initialization
  const hasInitialized = useRef(false);
  
  // Track component mount state
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Set up mount tracking
    isMounted.current = true;
    
    return () => {
      // Mark as unmounted
      isMounted.current = false;
    };
  }, []);
  
  // Create default profile for initialization
  const createDefaultProfile = (): ChildProfileType => {
    console.log("Creating default profile");
    return {
      id: 'profile-default',
      name: 'Test Child',
      birthdate: new Date(2020, 0, 1)
    };
  };
  
  // Load data from localStorage with proper error handling
  useEffect(() => {
    // Skip if already initialized to prevent double-loading
    if (hasInitialized.current) {
      console.log("Index already initialized, skipping re-initialization");
      return;
    }
    
    const loadData = () => {
      console.log("Index useEffect running - loading data");
      setIsLoading(true);
      setError(null);
      
      try {
        // Set initialization flag immediately
        hasInitialized.current = true;
        
        // Load profiles from localStorage with fallback
        let loadedProfiles: ChildProfileType[] = [];
        const savedProfiles = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
        
        if (savedProfiles) {
          try {
            const parsedProfiles = JSON.parse(savedProfiles);
            loadedProfiles = parsedProfiles.map((profile: any) => ({
              ...profile,
              birthdate: new Date(profile.birthdate)
            }));
            console.log("Successfully loaded profiles:", loadedProfiles.length);
          } catch (e) {
            console.error('Error parsing saved profiles, using default', e);
            loadedProfiles = [createDefaultProfile()];
          }
        } else {
          console.log("No saved profiles, using default profile");
          loadedProfiles = [createDefaultProfile()];
        }
        
        if (isMounted.current) {
          setProfiles(loadedProfiles);
          
          // If profiles exist, select the first one
          if (loadedProfiles.length > 0) {
            setSelectedProfileId(loadedProfiles[0].id);
          }
        }
        
        // Load temperatures from localStorage with fallback
        let loadedTemperatures: TemperatureReading[] = [];
        const savedTemperatures = localStorage.getItem(LOCAL_STORAGE_TEMPS_KEY);
        
        if (savedTemperatures) {
          try {
            const parsedTemperatures = JSON.parse(savedTemperatures);
            loadedTemperatures = parsedTemperatures.map((temp: any) => ({
              ...temp,
              timestamp: new Date(temp.timestamp)
            }));
            console.log("Successfully loaded temperatures:", loadedTemperatures.length);
          } catch (e) {
            console.error('Error parsing saved temperatures, using mock data', e);
            if (loadedProfiles.length > 0) {
              loadedTemperatures = generateMockReadings(loadedProfiles[0].id);
            }
          }
        } else {
          console.log("No saved temperatures, generating mock data");
          if (loadedProfiles.length > 0) {
            loadedTemperatures = generateMockReadings(loadedProfiles[0].id);
          }
        }
        
        if (isMounted.current) {
          setTemperatures(loadedTemperatures);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Critical error in Index useEffect:", e);
        
        if (isMounted.current) {
          setError("Failed to load application data. Please try refreshing the page.");
          
          // Fallback to default data even on error
          const defaultProfile = createDefaultProfile();
          setProfiles([defaultProfile]);
          setSelectedProfileId(defaultProfile.id);
          setTemperatures(generateMockReadings(defaultProfile.id));
          setIsLoading(false);
        }
      }
    };
    
    // Load data with a slight delay to ensure stable rendering
    const timer = setTimeout(loadData, 0);
    return () => clearTimeout(timer);
  }, []); // Empty dependencies to run only once
  
  // Save to localStorage whenever profiles change
  useEffect(() => {
    if (profiles.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
        console.log("Saved profiles to localStorage");
      } catch (e) {
        console.error("Failed to save profiles to localStorage:", e);
      }
    }
  }, [profiles]);
  
  // Save to localStorage whenever temperatures change
  useEffect(() => {
    if (temperatures.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_TEMPS_KEY, JSON.stringify(temperatures));
        console.log("Saved temperatures to localStorage");
      } catch (e) {
        console.error("Failed to save temperatures to localStorage:", e);
      }
    }
  }, [temperatures]);
  
  const handleProfileAdd = (profile: ChildProfileType) => {
    console.log("Adding profile:", profile.name);
    setProfiles(prev => [...prev, profile]);
    setSelectedProfileId(profile.id);
    
    // If this is the first profile, add some mock data for demonstration
    if (profiles.length === 0) {
      const mockReadings = generateMockReadings(profile.id);
      setTemperatures(mockReadings);
    }
    
    toast({
      title: "Profile Added",
      description: `${profile.name}'s profile has been saved.`
    });
  };
  
  const handleProfileSelect = (id: string) => {
    console.log("Selecting profile:", id);
    setSelectedProfileId(id);
    // Clear current temperature when switching profiles
    setCurrentTemperature(null);
  };
  
  const handleTemperatureSubmit = (temperature: Temperature) => {
    if (!selectedProfileId) return;
    
    console.log("Submitting temperature:", temperature.value, temperature.unit);
    const newReading: TemperatureReading = {
      ...temperature,
      id: `reading-${Date.now()}`,
      childId: selectedProfileId,
      timestamp: new Date()
    };
    
    setTemperatures(prev => [newReading, ...prev]);
    setCurrentTemperature(temperature);
    
    toast({
      title: "Temperature Recorded",
      description: "The temperature reading has been saved."
    });
  };
  
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileTemperatures = temperatures.filter(t => t.childId === selectedProfileId);
  
  console.log("Selected profile:", selectedProfile?.name || "none");
  console.log("Profile temperatures count:", profileTemperatures?.length || 0);
  
  // Render only once we have data
  return (
    <Layout>
      <div className="space-y-6" id="index-content">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
          <p className="text-muted-foreground mt-1">Guidance for parents when fever strikes</p>
        </header>
        
        {isLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-12 w-48 bg-muted mx-auto rounded"></div>
                <div className="h-4 w-64 bg-muted mx-auto rounded"></div>
                <div className="h-4 w-32 bg-muted mx-auto rounded"></div>
              </div>
              <p className="mt-6 text-muted-foreground">Loading your data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-center max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Application</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => {
                  hasInitialized.current = false;
                  window.location.reload();
                }}
                variant="destructive"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        ) : profiles.length > 0 ? (
          <>
            <ChildProfile 
              profiles={profiles}
              selectedProfileId={selectedProfileId || ''}
              onProfileSelect={handleProfileSelect}
              onProfileAdd={handleProfileAdd}
            />
            
            {selectedProfile && (
              <>
                <TemperatureInput onSubmit={handleTemperatureSubmit} />
                
                {currentTemperature && (
                  <AdviceDisplay 
                    temperature={currentTemperature}
                    childProfile={selectedProfile}
                  />
                )}
                
                {profileTemperatures.length > 0 && (
                  <>
                    <SymptomTracker 
                      childProfile={selectedProfile}
                      readings={profileTemperatures}
                    />
                    
                    <TemperatureHistory
                      readings={profileTemperatures}
                      childProfile={selectedProfile}
                      limit={3}
                    />
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p>No profiles found. Please add a child profile to get started.</p>
            <Button 
              onClick={() => {
                const defaultProfile = createDefaultProfile();
                handleProfileAdd(defaultProfile);
              }}
              className="mt-4"
            >
              Create Default Profile
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
