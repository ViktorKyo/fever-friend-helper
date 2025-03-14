
import { useState, useEffect, useCallback } from 'react';
import { Temperature, TemperatureReading, generateMockReadings } from '@/lib/feverGuide';
import { useToast } from '@/hooks/use-toast';

// Local storage key
const LOCAL_STORAGE_TEMPS_KEY = 'feverFriend_temperatures';

export function useTemperatures(selectedProfileId: string | null, isProfilesLoaded: boolean) {
  const { toast } = useToast();
  const [temperatures, setTemperatures] = useState<TemperatureReading[]>([]);
  const [currentTemperature, setCurrentTemperature] = useState<Temperature | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize temperatures from localStorage
  useEffect(() => {
    if (!isProfilesLoaded || !selectedProfileId) return;
    
    try {
      console.log("Loading temperatures from localStorage for profile", selectedProfileId);
      
      // Add timeout to ensure state updates properly
      setTimeout(() => {
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
            loadedTemperatures = generateMockReadings(selectedProfileId);
          }
        } else {
          loadedTemperatures = generateMockReadings(selectedProfileId);
          // Save mock data to localStorage
          localStorage.setItem(LOCAL_STORAGE_TEMPS_KEY, JSON.stringify(loadedTemperatures));
        }
        
        console.log("Loaded temperatures:", loadedTemperatures);
        setTemperatures(loadedTemperatures);
        setIsLoaded(true);
      }, 100);
    } catch (e) {
      console.error('Error initializing temperatures:', e);
      setError("Failed to load temperature data. Using default values.");
      
      // Fallback to mock readings
      if (selectedProfileId) {
        setTemperatures(generateMockReadings(selectedProfileId));
      }
      setIsLoaded(true);
    }
  }, [isProfilesLoaded, selectedProfileId]);

  // Save to localStorage whenever temperatures change
  useEffect(() => {
    if (!isLoaded) return; // Skip saving until initial load is complete

    try {
      if (temperatures.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_TEMPS_KEY, JSON.stringify(temperatures));
      }
    } catch (e) {
      console.error('Error saving temperatures to localStorage:', e);
      setError("Failed to save temperature data to localStorage.");
    }
  }, [temperatures, isLoaded]);

  // Reset current temperature when profile changes
  useEffect(() => {
    setCurrentTemperature(null);
  }, [selectedProfileId]);

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

  return {
    temperatures,
    currentTemperature,
    isLoaded,
    error,
    profileTemperatures: temperatures.filter(t => t.childId === selectedProfileId),
    handleTemperatureSubmit
  };
}
