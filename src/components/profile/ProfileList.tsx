
import React from 'react';
import { ChildProfile as ChildProfileType } from '@/lib/feverGuide';
import { User } from 'lucide-react';
import { Card, CardDescription } from '@/components/ui/card';
import ProfileCard from './ProfileCard';

interface ProfileListProps {
  profiles: ChildProfileType[];
  selectedProfileId: string | null;
  onProfileSelect: (id: string) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ 
  profiles, 
  selectedProfileId, 
  onProfileSelect 
}) => {
  if (profiles.length === 0) {
    return (
      <Card className="glass-morphism p-6 flex flex-col items-center justify-center text-center">
        <User className="h-12 w-12 mb-4 text-primary/40" />
        <CardDescription>
          No profiles yet. Add your child's details to get started.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {profiles.map(profile => (
        <ProfileCard 
          key={profile.id}
          profile={profile}
          isSelected={profile.id === selectedProfileId}
          onSelect={() => onProfileSelect(profile.id)}
        />
      ))}
    </div>
  );
};

export default ProfileList;
