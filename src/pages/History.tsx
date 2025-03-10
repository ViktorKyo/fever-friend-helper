
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  TemperatureReading,
  ChildProfile as ChildProfileType,
  getSeverity,
  getAgeGroup
} from '@/lib/feverGuide';
import TemperatureHistory from '@/components/TemperatureHistory';
import { slideUpAnimation } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

const History = () => {
  const [profiles, setProfiles] = useState<ChildProfileType[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [temperatures, setTemperatures] = useState<TemperatureReading[]>([]);
  
  // On mount, check for saved profiles and temperatures
  React.useEffect(() => {
    const savedProfiles = localStorage.getItem('feverFriend_profiles');
    const savedTemperatures = localStorage.getItem('feverFriend_temperatures');
    
    if (savedProfiles) {
      try {
        const parsedProfiles = JSON.parse(savedProfiles);
        // Convert string dates back to Date objects
        const processedProfiles = parsedProfiles.map((profile: any) => ({
          ...profile,
          birthdate: new Date(profile.birthdate)
        }));
        setProfiles(processedProfiles);
        
        // If profiles exist, select the first one
        if (processedProfiles.length > 0) {
          setSelectedProfileId(processedProfiles[0].id);
        }
      } catch (e) {
        console.error('Error parsing saved profiles', e);
      }
    }
    
    if (savedTemperatures) {
      try {
        const parsedTemperatures = JSON.parse(savedTemperatures);
        // Convert string dates back to Date objects
        const processedTemperatures = parsedTemperatures.map((temp: any) => ({
          ...temp,
          timestamp: new Date(temp.timestamp)
        }));
        setTemperatures(processedTemperatures);
      } catch (e) {
        console.error('Error parsing saved temperatures', e);
      }
    }
  }, []);
  
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileTemperatures = temperatures.filter(t => t.childId === selectedProfileId);
  
  return (
    <Layout>
      <div className="space-y-6">
        <Card className={cn("glass-morphism", slideUpAnimation(100))}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Temperature History
            </CardTitle>
            <CardDescription>
              Complete history of recorded temperature readings
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {selectedProfile ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">{selectedProfile?.name}'s History</h2>
                
                {profileTemperatures.length > 0 ? (
                  <TemperatureHistory
                    readings={profileTemperatures}
                    childProfile={selectedProfile}
                  />
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No temperature readings have been recorded yet.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Please create a child profile on the home page first.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default History;
