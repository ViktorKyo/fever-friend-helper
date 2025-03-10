
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Plus, User, X } from 'lucide-react';
import { ChildProfile as ChildProfileType } from '@/lib/feverGuide';
import { slideUpAnimation } from '@/lib/animations';

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
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [weight, setWeight] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthdate) return;
    
    const newProfile: ChildProfileType = {
      id: `profile-${Date.now()}`,
      name,
      birthdate,
      weight: weight ? parseFloat(weight) : undefined
    };
    
    onProfileAdd(newProfile);
    resetForm();
  };
  
  const resetForm = () => {
    setName('');
    setBirthdate(undefined);
    setWeight('');
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.length === 0 ? (
              <Card className="glass-morphism p-6 flex flex-col items-center justify-center text-center">
                <User className="h-12 w-12 mb-4 text-primary/40" />
                <CardDescription>
                  No profiles yet. Add your child's details to get started.
                </CardDescription>
              </Card>
            ) : (
              profiles.map(profile => (
                <ProfileCard 
                  key={profile.id}
                  profile={profile}
                  isSelected={profile.id === selectedProfileId}
                  onSelect={() => onProfileSelect(profile.id)}
                />
              ))
            )}
          </div>
        </>
      )}

      {showForm && (
        <Card className={cn("glass-morphism", slideUpAnimation())}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Add Child Profile</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowForm(false)} 
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Enter your child's details to customize fever guidance.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Child's name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="input-focus-ring"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthdate">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="birthdate"
                      className={cn(
                        "w-full justify-start text-left font-normal input-focus-ring",
                        !birthdate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthdate ? format(birthdate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={birthdate}
                      onSelect={setBirthdate}
                      initialFocus
                      disabled={(date) => date > new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                <Input 
                  id="weight" 
                  type="number" 
                  step="0.1"
                  min="0"
                  placeholder="Weight in kg" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                  className="input-focus-ring"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!name || !birthdate}>
                Save Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

interface ProfileCardProps {
  profile: ChildProfileType;
  isSelected: boolean;
  onSelect: () => void;
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

function calculateAge(birthdate: Date): string {
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

export default ChildProfile;
