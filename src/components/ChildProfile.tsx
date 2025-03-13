
import React, { useState } from 'react';
import { ChildProfile as ChildProfileType } from '@/lib/feverGuide';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { slideUpAnimation } from '@/lib/animations';
import ProfileForm from './profile/ProfileForm';
import ProfileList from './profile/ProfileList';

interface ChildProfileProps {
  profiles: ChildProfileType[];
  selectedProfileId: string | null;
  onProfileSelect: (id: string) => void;
  onProfileAdd: (profile: ChildProfileType) => void;
}

const ChildProfile: React.FC<ChildProfileProps> = ({ 
  profiles, 
  selectedProfileId,
  onProfileSelect,
  onProfileAdd
}) => {
  const [showForm, setShowForm] = useState(false);

  const handleProfileSubmit = (profile: ChildProfileType) => {
    onProfileAdd(profile);
    setShowForm(false);
  };

  return (
    <div className={cn("space-y-4", slideUpAnimation())}>
      {!showForm && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Child Profiles</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowForm(true)}
              className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Child
            </Button>
          </div>
          
          <ProfileList 
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onProfileSelect={onProfileSelect}
          />
        </>
      )}

      {showForm && (
        <ProfileForm 
          onSubmit={handleProfileSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ChildProfile;
