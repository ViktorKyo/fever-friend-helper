
import React, { useState, useEffect, useCallback, useRef } from 'react';
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

const Index = () => {
  console.log("Index page rendering - component initialized");
  
  // Prevent multiple initializations
  const initialized = useRef(false);
  
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ChildProfileType[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [temperatures, setTemperatures] = useState<TemperatureReading[]>([]);
  const [currentTemperature, setCurrentTemperature] = useState<Temperature | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create default profile for initialization
  const createDefaultProfile = useCallback((): ChildProfileType => {
    console.log("Creating default profile");
    return {
      id: 'profile-default',
      name: 'Test Child',
      birthdate: new Date(2020, 0, 1)
    };
  }, []);
  
  // Load data from localStorage with proper error handling
  useEffect(() => {
    // Prevent double initialization
    if (initialized.current) {
      console.log("Index already initialized, skipping second initialization");
      return;
    }
    
    initialized.current = true;
    console.log("Index useEffect running - loading data");
    setIsLoading(true);
    
    try {
      // Load profiles from localStorage with fallback
      let processedProfiles: ChildProfileType[] = [];
      const savedProfiles = localStorage.getItem('feverFriend_profiles');
      
      if (savedProfiles) {
        try {
          const parsedProfiles = JSON.parse(savedProfiles);
          processedProfiles = parsedProfiles.map((profile: any) => ({
            ...profile,
            birthdate: new Date(profile.birthdate)
          }));
          console.log("Successfully loaded profiles:", processedProfiles.length);
        } catch (e) {
          console.error('Error parsing saved profiles, using default', e);
          processedProfiles = [createDefaultProfile()];
        }
      } else {
        console.log("No saved profiles, using default profile");
        processedProfiles = [createDefaultProfile()];
      }
      
      setProfiles(processedProfiles);
      
      // If profiles exist, select the first one
      if (processedProfiles.length > 0) {
        setSelectedProfileId(processedProfiles[0].id);
      }
      
      // Load temperatures from localStorage with fallback
      let processedTemperatures: TemperatureReading[] = [];
      const savedTemperatures = localStorage.getItem('feverFriend_temperatures');
      
      if (savedTemperatures) {
        try {
          const parsedTemperatures = JSON.parse(savedTemperatures);
          processedTemperatures = parsedTemperatures.map((temp: any) => ({
            ...temp,
            timestamp: new Date(temp.timestamp)
          }));
          console.log("Successfully loaded temperatures:", processedTemperatures.length);
        } catch (e) {
          console.error('Error parsing saved temperatures, using mock data', e);
          if (processedProfiles.length > 0) {
            processedTemperatures = generateMockReadings(processedProfiles[0].id);
          }
        }
      } else {
        console.log("No saved temperatures, generating mock data");
        if (processedProfiles.length > 0) {
          processedTemperatures = generateMockReadings(processedProfiles[0].id);
        }
      }
      
      setTemperatures(processedTemperatures);
    } catch (e) {
      console.error("Critical error in Index useEffect:", e);
      // Fallback to default data
      const defaultProfile = createDefaultProfile();
      setProfiles([defaultProfile]);
      setSelectedProfileId(defaultProfile.id);
      setTemperatures(generateMockReadings(defaultProfile.id));
    } finally {
      setIsLoading(false);
      console.log("Data loading complete");
    }
  }, [createDefaultProfile]);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    if (profiles.length > 0) {
      try {
        localStorage.setItem('feverFriend_profiles', JSON.stringify(profiles));
        console.log("Saved profiles to localStorage");
      } catch (e) {
        console.error("Failed to save profiles to localStorage:", e);
      }
    }
  }, [profiles]);
  
  useEffect(() => {
    if (temperatures.length > 0) {
      try {
        localStorage.setItem('feverFriend_temperatures', JSON.stringify(temperatures));
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
      childId: selectedProfileId
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
  
  console.log("Selected profile:", selectedProfile?.name);
  console.log("Profile temperatures count:", profileTemperatures?.length);
  
  // If we're loading, show a loading indicator
  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-40 bg-muted rounded mb-4"></div>
            <div className="h-4 w-60 bg-muted rounded"></div>
          </div>
          <p className="mt-8 text-muted-foreground">Loading application data...</p>
        </div>
      </Layout>
    );
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
      </div>
    </Layout>
  );
};

export default Index;
