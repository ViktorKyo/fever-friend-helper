
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
import { Thermometer } from 'lucide-react';

const Index = () => {
  console.log("Index page rendering");
  
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ChildProfileType[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [temperatures, setTemperatures] = useState<TemperatureReading[]>([]);
  const [currentTemperature, setCurrentTemperature] = useState<Temperature | null>(null);
  
  // On mount, check for saved profiles
  useEffect(() => {
    console.log("Index useEffect running");
    
    // Create a default profile if none exists for testing
    const defaultProfile: ChildProfileType = {
      id: 'profile-default',
      name: 'Test Child',
      birthdate: new Date(2020, 0, 1)
    };
    
    try {
      const savedProfiles = localStorage.getItem('feverFriend_profiles');
      const savedTemperatures = localStorage.getItem('feverFriend_temperatures');
      
      let processedProfiles: ChildProfileType[] = [];
      
      if (savedProfiles) {
        try {
          const parsedProfiles = JSON.parse(savedProfiles);
          // Convert string dates back to Date objects
          processedProfiles = parsedProfiles.map((profile: any) => ({
            ...profile,
            birthdate: new Date(profile.birthdate)
          }));
          console.log("Loaded profiles:", processedProfiles);
        } catch (e) {
          console.error('Error parsing saved profiles', e);
          processedProfiles = [defaultProfile];
        }
      } else {
        // No saved profiles, use default
        processedProfiles = [defaultProfile];
        console.log("Using default profile");
      }
      
      setProfiles(processedProfiles);
      
      // If profiles exist, select the first one
      if (processedProfiles.length > 0) {
        setSelectedProfileId(processedProfiles[0].id);
      }
      
      let processedTemperatures: TemperatureReading[] = [];
      
      if (savedTemperatures) {
        try {
          const parsedTemperatures = JSON.parse(savedTemperatures);
          // Convert string dates back to Date objects
          processedTemperatures = parsedTemperatures.map((temp: any) => ({
            ...temp,
            timestamp: new Date(temp.timestamp)
          }));
          console.log("Loaded temperatures:", processedTemperatures);
        } catch (e) {
          console.error('Error parsing saved temperatures', e);
          // Generate mock data if parsing fails
          if (processedProfiles.length > 0) {
            processedTemperatures = generateMockReadings(processedProfiles[0].id);
          }
        }
      } else {
        // No saved temperatures, generate mock data
        if (processedProfiles.length > 0) {
          processedTemperatures = generateMockReadings(processedProfiles[0].id);
        }
      }
      
      setTemperatures(processedTemperatures);
      
    } catch (e) {
      console.error("Error in Index useEffect:", e);
      // Fallback to default data
      setProfiles([defaultProfile]);
      setSelectedProfileId(defaultProfile.id);
      setTemperatures(generateMockReadings(defaultProfile.id));
    }
  }, []);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('feverFriend_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);
  
  useEffect(() => {
    if (temperatures.length > 0) {
      localStorage.setItem('feverFriend_temperatures', JSON.stringify(temperatures));
    }
  }, [temperatures]);
  
  const handleProfileAdd = (profile: ChildProfileType) => {
    console.log("Adding profile:", profile);
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
    
    console.log("Submitting temperature:", temperature);
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
  
  console.log("Selected profile:", selectedProfile);
  console.log("Profile temperatures count:", profileTemperatures?.length);
  
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
            <p>Loading profiles...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
