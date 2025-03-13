
import React, { useState, useEffect } from 'react';
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
const createDefaultProfile = (): ChildProfileType => {
  return {
    id: 'profile-default',
    name: 'Test Child',
    birthdate: new Date(2020, 0, 1)
  };
};

const Index = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ChildProfileType[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [temperatures, setTemperatures] = useState<TemperatureReading[]>([]);
  const [currentTemperature, setCurrentTemperature] = useState<Temperature | null>(null);

  // Initialize data once on mount
  useEffect(() => {
    // Load profiles
    let loadedProfiles: ChildProfileType[] = [];
    try {
      const savedProfiles = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      
      if (savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles);
        loadedProfiles = parsedProfiles.map((profile: any) => ({
          ...profile,
          birthdate: new Date(profile.birthdate)
        }));
      } else {
        loadedProfiles = [createDefaultProfile()];
      }
    } catch (e) {
      console.error('Error loading profiles, using default', e);
      loadedProfiles = [createDefaultProfile()];
    }
    
    setProfiles(loadedProfiles);
    
    // If profiles exist, select the first one
    if (loadedProfiles.length > 0) {
      setSelectedProfileId(loadedProfiles[0].id);
    }
    
    // Load temperatures
    let loadedTemperatures: TemperatureReading[] = [];
    try {
      const savedTemperatures = localStorage.getItem(LOCAL_STORAGE_TEMPS_KEY);
      
      if (savedTemperatures) {
        const parsedTemperatures = JSON.parse(savedTemperatures);
        loadedTemperatures = parsedTemperatures.map((temp: any) => ({
          ...temp,
          timestamp: new Date(temp.timestamp)
        }));
      } else if (loadedProfiles.length > 0) {
        loadedTemperatures = generateMockReadings(loadedProfiles[0].id);
      }
    } catch (e) {
      console.error('Error loading temperatures, using mock data', e);
      if (loadedProfiles.length > 0) {
        loadedTemperatures = generateMockReadings(loadedProfiles[0].id);
      }
    }
    
    setTemperatures(loadedTemperatures);
  }, []);
  
  // Save to localStorage whenever profiles or temperatures change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
    }
    
    if (temperatures.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_TEMPS_KEY, JSON.stringify(temperatures));
    }
  }, [profiles, temperatures]);
  
  const handleProfileAdd = (profile: ChildProfileType) => {
    setProfiles(prev => [...prev, profile]);
    setSelectedProfileId(profile.id);
    
    // If this is the first profile, add some mock data
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
    setSelectedProfileId(id);
    setCurrentTemperature(null);
  };
  
  const handleTemperatureSubmit = (temperature: Temperature) => {
    if (!selectedProfileId) return;
    
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
