
import { useState, useEffect, useCallback } from 'react';
import { ChildProfile as ChildProfileType } from '@/lib/feverGuide';
import { useToast } from '@/hooks/use-toast';

// Local storage keys
const LOCAL_STORAGE_PROFILES_KEY = 'feverFriend_profiles';

// Create default profile for initialization
const createDefaultProfile = (): ChildProfileType => ({
  id: 'profile-default',
  name: 'Test Child',
  birthdate: new Date(2020, 0, 1)
});

export function useProfiles() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ChildProfileType[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize profiles from localStorage
  useEffect(() => {
    try {
      console.log("Loading profiles from localStorage");
      
      // Add timeout to ensure state updates properly
      setTimeout(() => {
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
          // Save default profile to localStorage
          localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(loadedProfiles));
        }
        
        console.log("Loaded profiles:", loadedProfiles);
        setProfiles(loadedProfiles);
        
        // If profiles exist, select the first one
        if (loadedProfiles.length > 0) {
          setSelectedProfileId(loadedProfiles[0].id);
        }
        
        setIsLoaded(true);
      }, 100);
    } catch (e) {
      console.error('Error initializing profiles:', e);
      setError("Failed to load profiles. Using default values.");
      
      // Fallback to default values
      const defaultProfile = createDefaultProfile();
      setProfiles([defaultProfile]);
      setSelectedProfileId(defaultProfile.id);
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever profiles change
  useEffect(() => {
    if (!isLoaded) return; // Skip saving until initial load is complete

    try {
      if (profiles.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
      }
    } catch (e) {
      console.error('Error saving profiles to localStorage:', e);
      setError("Failed to save profiles to localStorage.");
    }
  }, [profiles, isLoaded]);

  const handleProfileAdd = useCallback((profile: ChildProfileType) => {
    console.log("Adding profile:", profile);
    setProfiles(prev => [...prev, profile]);
    setSelectedProfileId(profile.id);
    
    toast({
      title: "Profile Added",
      description: `${profile.name}'s profile has been saved.`
    });
  }, [toast]);
  
  const handleProfileSelect = useCallback((id: string) => {
    console.log("Selecting profile:", id);
    setSelectedProfileId(id);
  }, []);

  const createNewDefaultProfile = useCallback(() => {
    const defaultProfile = createDefaultProfile();
    handleProfileAdd(defaultProfile);
  }, [handleProfileAdd]);

  return {
    profiles,
    selectedProfileId,
    isLoaded,
    error,
    selectedProfile: profiles.find(p => p.id === selectedProfileId),
    handleProfileAdd,
    handleProfileSelect,
    createNewDefaultProfile
  };
}
