
import React, { useState, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, Check } from 'lucide-react';
import { 
  Symptom, 
  Temperature, 
  TemperatureUnit, 
  convertTemperature 
} from '@/lib/feverGuide';
import { cn } from '@/lib/utils';
import { slideUpAnimation } from '@/lib/animations';
import TemperatureField from './temperature/TemperatureField';
import SymptomSelector from './temperature/SymptomSelector';
import NotesField from './temperature/NotesField';

interface TemperatureInputProps {
  onSubmit: (temperature: Temperature) => void;
}

const TemperatureInput: React.FC<TemperatureInputProps> = ({ onSubmit }) => {
  const [activeUnit, setActiveUnit] = useState<TemperatureUnit>('C');
  const [temperature, setTemperature] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState<string>('');

  const handleUnitChange = useCallback((value: string) => {
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
  }, [temperature, activeUnit]);

  const handleSymptomToggle = useCallback((symptom: Symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
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
  }, [temperature, activeUnit, selectedSymptoms, notes, onSubmit]);

  const isValidTemp = (): boolean => {
    const temp = parseFloat(temperature);
    if (isNaN(temp)) return false;
    
    if (activeUnit === 'C') {
      return temp >= 35 && temp <= 42;
    } else {
      return temp >= 95 && temp <= 108;
    }
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
          <TemperatureField 
            temperature={temperature}
            activeUnit={activeUnit}
            onTemperatureChange={setTemperature}
            onUnitChange={handleUnitChange}
          />
          
          <SymptomSelector 
            selectedSymptoms={selectedSymptoms}
            onSymptomToggle={handleSymptomToggle}
          />
          
          <NotesField 
            notes={notes}
            onNotesChange={setNotes}
          />
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
