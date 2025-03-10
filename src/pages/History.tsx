
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import TemperatureHistory from '@/components/TemperatureHistory';
import { 
  ChildProfile as ChildProfileType, 
  TemperatureReading
} from '@/lib/feverGuide';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, ChevronLeft, Download, FileDown, ListFilter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const History = () => {
  const [profiles, setProfiles] = useState<ChildProfileType[]>([]);
  const [temperatures, setTemperatures] = useState<TemperatureReading[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  
  // On mount, load data from localStorage
  useEffect(() => {
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
  
  const handleProfileChange = (profileId: string) => {
    setSelectedProfileId(profileId);
  };
  
  const handleExportData = () => {
    if (!selectedProfileId) return;
    
    const selectedProfile = profiles.find(p => p.id === selectedProfileId);
    if (!selectedProfile) return;
    
    const profileTemperatures = temperatures.filter(t => t.childId === selectedProfileId);
    
    const exportData = {
      profile: selectedProfile,
      temperatures: profileTemperatures
    };
    
    // Convert to CSV format
    const csvContent = [
      ["Date", "Time", "Temperature", "Unit", "Symptoms", "Notes"].join(","),
      ...profileTemperatures.map(t => [
        format(t.timestamp, 'yyyy-MM-dd'),
        format(t.timestamp, 'HH:mm'),
        t.value.toString(),
        t.unit,
        t.symptoms.join(';'),
        t.notes || ''
      ].join(","))
    ].join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedProfile.name}_fever_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileTemperatures = temperatures.filter(t => t.childId === selectedProfileId);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Temperature History</h1>
          <div className="w-16" /> {/* Spacer for alignment */}
        </div>
        
        {profiles.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div className="w-full sm:w-64">
                <Select value={selectedProfileId || ''} onValueChange={handleProfileChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a child" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map(profile => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedProfile && profileTemperatures.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  className="gap-1"
                >
                  <FileDown className="h-4 w-4" />
                  Export Data
                </Button>
              )}
            </div>
            
            {selectedProfile ? (
              profileTemperatures.length > 0 ? (
                <TemperatureHistory
                  readings={profileTemperatures}
                  childProfile={selectedProfile}
                />
              ) : (
                <div className="text-center py-10">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground mt-2">
                    No temperature history recorded for {selectedProfile.name} yet
                  </p>
                  <Link to="/">
                    <Button className="mt-4">
                      Record a Temperature
                    </Button>
                  </Link>
                </div>
              )
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Select a child to view their temperature history</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No child profiles found. Add a profile to start tracking temperatures.
            </p>
            <Link to="/">
              <Button className="mt-4">
                Add a Child Profile
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;
