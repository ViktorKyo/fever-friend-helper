
import React, { useState } from 'react';
import { ChildProfile as ChildProfileType } from '@/lib/feverGuide';
import { cn } from '@/lib/utils';
import { slideUpAnimation } from '@/lib/animations';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
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

interface ProfileFormProps {
  onSubmit: (profile: ChildProfileType) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, onCancel }) => {
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
    
    onSubmit(newProfile);
  };

  return (
    <Card className={cn("glass-morphism", slideUpAnimation())}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Add Child Profile</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel} 
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name || !birthdate}>
            Save Profile
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileForm;
