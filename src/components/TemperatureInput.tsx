
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
import { Thermometer, AlertTriangle, Check } from 'lucide-react';
import { 
  Symptom, 
  Temperature, 
  TemperatureUnit, 
  formatTemperature, 
  convertTemperature 
} from '@/lib/feverGuide';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { slideUpAnimation } from '@/lib/animations';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TemperatureInputProps {
  onSubmit: (temperature: Temperature) => void;
}

const symptomOptions: { label: string; value: Symptom }[] = [
  { label: 'Rash', value: 'rash' },
  { label: 'Vomiting', value: 'vomiting' },
  { label: 'Diarrhea', value: 'diarrhea' },
  { label: 'Difficulty Breathing', value: 'breathing' },
  { label: 'Unusual Sleepiness/Lethargy', value: 'lethargy' },
  { label: 'Signs of Dehydration', value: 'dehydration' },
  { label: 'Headache', value: 'headache' },
  { label: 'Sore Throat', value: 'soreThroat' }
];

const TemperatureInput: React.FC<TemperatureInputProps> = ({ onSubmit }) => {
  const [activeUnit, setActiveUnit] = useState<TemperatureUnit>('C');
  const [temperature, setTemperature] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState<string>('');

  const handleUnitChange = (value: string) => {
    if (temperature && (value === 'C' || value === 'F')) {
      const currentTemp = parseFloat(temperature);
      if (!isNaN(currentTemp)) {
        const convertedTemp = convertTemperature(
          currentTemp,
          activeUnit,
          value as TemperatureUnit
        );
        setTemperature(convertedTemp.toFixed(1));
      }
    }
    setActiveUnit(value as TemperatureUnit);
  };

  const handleSymptomToggle = (symptom: Symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const temp = parseFloat(temperature);
    if (isNaN(temp)) return;
    
    const temperatureData: Temperature = {
      value: temp,
      unit: activeUnit,
      timestamp: new Date(),
      symptoms: selectedSymptoms,
      notes: notes.trim() || undefined
    };
    
    onSubmit(temperatureData);
    
    // Reset form for next entry
    setTemperature('');
    setSelectedSymptoms([]);
    setNotes('');
  };

  const isValidTemp = (): boolean => {
    const temp = parseFloat(temperature);
    if (isNaN(temp)) return false;
    
    if (activeUnit === 'C') {
      return temp >= 35 && temp <= 42;
    } else {
      return temp >= 95 && temp <= 108;
    }
  };

  const getNormalRangeText = (): string => {
    return activeUnit === 'C' 
      ? '36.5°C - 37.5°C' 
      : '97.7°F - 99.5°F';
  };

  return (
    <Card className={cn("glass-morphism border-muted/30", slideUpAnimation(100))}>
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          Record Temperature
        </CardTitle>
        <CardDescription>
          Enter your child's current temperature and any symptoms
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Tabs 
            defaultValue="C" 
            value={activeUnit} 
            onValueChange={handleUnitChange}
            className="w-full"
          >
            <div className="flex items-center justify-between">
              <Label className="font-medium">Temperature</Label>
              <TabsList className="grid grid-cols-2 w-24">
                <TabsTrigger value="C">°C</TabsTrigger>
                <TabsTrigger value="F">°F</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="C" className="mt-2">
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="37.5"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="pr-10 text-lg font-medium input-focus-ring"
                  min="35"
                  max="42"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  °C
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Normal range: {getNormalRangeText()}
              </p>
            </TabsContent>
            
            <TabsContent value="F" className="mt-2">
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="99.5"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="pr-10 text-lg font-medium input-focus-ring"
                  min="95"
                  max="108"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  °F
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Normal range: {getNormalRangeText()}
              </p>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-2">
            <Label className="font-medium">Symptoms</Label>
            <div className="grid grid-cols-2 gap-2">
              {symptomOptions.map((symptom) => (
                <div key={symptom.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`symptom-${symptom.value}`}
                    checked={selectedSymptoms.includes(symptom.value)}
                    onCheckedChange={() => handleSymptomToggle(symptom.value)}
                  />
                  <Label 
                    htmlFor={`symptom-${symptom.value}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {symptom.label}
                    {(symptom.value === 'breathing' || symptom.value === 'lethargy' || symptom.value === 'dehydration') && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangle className="inline h-3 w-3 ml-1 text-fever-accent" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">This symptom may require immediate medical attention</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-medium">Notes <span className="text-muted-foreground text-xs">(Optional)</span></Label>
            <Textarea 
              id="notes"
              placeholder="Any additional observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none input-focus-ring"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!isValidTemp()}
          >
            <Check className="mr-2 h-4 w-4" />
            Save Temperature Reading
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TemperatureInput;
