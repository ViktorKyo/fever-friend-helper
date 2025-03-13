
import React, { useState, useEffect, useCallback } from 'react';
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

// Define keys for localStorage
const LOCAL_STORAGE_PROFILES_KEY = 'feverFriend_profiles';
const LOCAL_STORAGE_TEMPS_KEY = 'feverFriend_temperatures';

// Create default profile for initialization
const createDefaultProfile = (): ChildProfileType => ({
  id: 'profile-default',
  name: 'Test Child',
  birthdate: new Date(2020, 0, 1)
});

const Index = () => {
  const { toast } = useToast();
  
  // State initialization with default values
  const [profiles, setProfiles] = useState<ChildProfileType[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [temperatures, setTemperatures] = useState<TemperatureReading[]>([]);
  const [currentTemperature, setCurrentTemperature] = useState<Temperature | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data once on mount with error handling
  useEffect(() => {
    try {
      console.log("Loading data from localStorage");
      
      // Load profiles
      let loadedProfiles: ChildProfileType[] = [];
      const savedProfiles = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      
      if (savedProfiles) {
        try {
          const parsedProfiles = JSON.parse(savedProfiles);
          loadedProfiles = parsedProfiles.map((profile: any) => ({
            ...profile,
            birthdate: new Date(profile.birthdate)
          }));
        } catch (parseError) {
          console.error("Error parsing profiles:", parseError);
          loadedProfiles = [createDefaultProfile()];
        }
      } else {
        loadedProfiles = [createDefaultProfile()];
      }
      
      console.log("Loaded profiles:", loadedProfiles);
      setProfiles(loadedProfiles);
      
      // If profiles exist, select the first one
      if (loadedProfiles.length > 0) {
        setSelectedProfileId(loadedProfiles[0].id);
      }
      
      // Load temperatures
      let loadedTemperatures: TemperatureReading[] = [];
      const savedTemperatures = localStorage.getItem(LOCAL_STORAGE_TEMPS_KEY);
      
      if (savedTemperatures) {
        try {
          const parsedTemperatures = JSON.parse(savedTemperatures);
          loadedTemperatures = parsedTemperatures.map((temp: any) => ({
            ...temp,
            timestamp: new Date(temp.timestamp)
          }));
        } catch (parseError) {
          console.error("Error parsing temperatures:", parseError);
          if (loadedProfiles.length > 0) {
            loadedTemperatures = generateMockReadings(loadedProfiles[0].id);
          }
        }
      } else if (loadedProfiles.length > 0) {
        loadedTemperatures = generateMockReadings(loadedProfiles[0].id);
      }
      
      console.log("Loaded temperatures:", loadedTemperatures);
      setTemperatures(loadedTemperatures);
    } catch (e) {
      console.error('Error initializing data:', e);
      setError("Failed to load data. Using default values.");
      
      // Fallback to default values
      const defaultProfile = createDefaultProfile();
      setProfiles([defaultProfile]);
      setSelectedProfileId(defaultProfile.id);
      setTemperatures(generateMockReadings(defaultProfile.id));
    } finally {
      setIsLoaded(true);
    }
  }, []);
  
  // Save to localStorage whenever profiles or temperatures change
  useEffect(() => {
    if (!isLoaded) return; // Skip saving until initial load is complete

    try {
      if (profiles.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
      }
      
      if (temperatures.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_TEMPS_KEY, JSON.stringify(temperatures));
      }
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      setError("Failed to save data to localStorage.");
    }
  }, [profiles, temperatures, isLoaded]);
  
  const handleProfileAdd = useCallback((profile: ChildProfileType) => {
    console.log("Adding profile:", profile);
    setProfiles(prev => [...prev, profile]);
    setSelectedProfileId(profile.id);
    
    // If this is the first profile, add some mock data
    setProfiles(prev => {
      if (prev.length === 0) {
        const mockReadings = generateMockReadings(profile.id);
        setTemperatures(mockReadings);
      }
      return [...prev, profile];
    });
    
    toast({
      title: "Profile Added",
      description: `${profile.name}'s profile has been saved.`
    });
  }, [toast]);
  
  const handleProfileSelect = useCallback((id: string) => {
    console.log("Selecting profile:", id);
    setSelectedProfileId(id);
    setCurrentTemperature(null);
  }, []);
  
  const handleTemperatureSubmit = useCallback((temperature: Temperature) => {
    if (!selectedProfileId) {
      console.error("No profile selected");
      return;
    }
    
    console.log("Submitting temperature:", temperature, "for profile:", selectedProfileId);
    
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
  }, [selectedProfileId, toast]);
  
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileTemperatures = temperatures.filter(t => t.childId === selectedProfileId);

  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground animate-pulse">Loading application data...</p>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    console.error("Rendering with error:", error);
  }

  return (
    <Layout>
      <div className="space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Fever Friend</h1>
          <p className="text-muted-foreground mt-1">Guidance for parents when fever strikes</p>
        </header>
        
        {profiles.length > 0 ? (
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
        
        {error && (
          <div className="p-4 mt-4 bg-destructive/10 text-destructive rounded-md">
            <p>{error}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
