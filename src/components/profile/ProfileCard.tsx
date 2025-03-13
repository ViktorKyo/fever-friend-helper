
import React from 'react';
import { cn } from '@/lib/utils';
import { ChildProfile as ChildProfileType } from '@/lib/feverGuide';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileCardProps {
  profile: ChildProfileType;
  isSelected: boolean;
  onSelect: () => void;
}

export function calculateAge(birthdate: Date): string {
  const today = new Date();
  let years = today.getFullYear() - birthdate.getFullYear();
  let months = today.getMonth() - birthdate.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birthdate.getDate())) {
    years--;
    months += 12;
  }
  
  if (years === 0) {
    if (months === 0) {
      const days = Math.floor((today.getTime() - birthdate.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} ${days === 1 ? 'day' : 'days'} old`;
    }
    return `${months} ${months === 1 ? 'month' : 'months'} old`;
  }
  
  return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'} old`;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isSelected, onSelect }) => {
  const age = calculateAge(profile.birthdate);
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 cursor-pointer",
        isSelected 
          ? "bg-primary/10 border-primary/30" 
          : "bg-card border-border hover:border-primary/20 hover:bg-primary/5"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-colors",
            isSelected ? "bg-primary text-primary-foreground" : "bg-fever-light text-fever-dark"
          )}>
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium text-lg">{profile.name}</h3>
            <p className="text-muted-foreground text-sm">{age}</p>
          </div>
        </div>
        {profile.weight && (
          <p className="text-xs text-muted-foreground mt-2">
            Weight: {profile.weight} kg
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
