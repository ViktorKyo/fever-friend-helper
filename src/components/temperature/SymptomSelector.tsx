
import React from 'react';
import { Symptom } from '@/lib/feverGuide';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SymptomSelectorProps {
  selectedSymptoms: Symptom[];
  onSymptomToggle: (symptom: Symptom) => void;
}

export const symptomOptions: { label: string; value: Symptom }[] = [
  { label: 'Rash', value: 'rash' },
  { label: 'Vomiting', value: 'vomiting' },
  { label: 'Diarrhea', value: 'diarrhea' },
  { label: 'Difficulty Breathing', value: 'breathing' },
  { label: 'Unusual Sleepiness/Lethargy', value: 'lethargy' },
  { label: 'Signs of Dehydration', value: 'dehydration' },
  { label: 'Headache', value: 'headache' },
  { label: 'Sore Throat', value: 'soreThroat' }
];

const SymptomSelector: React.FC<SymptomSelectorProps> = ({ 
  selectedSymptoms, 
  onSymptomToggle 
}) => {
  return (
    <div className="space-y-2">
      <Label className="font-medium">Symptoms</Label>
      <div className="grid grid-cols-2 gap-2">
        {symptomOptions.map((symptom) => (
          <div key={symptom.value} className="flex items-center space-x-2">
            <Checkbox 
              id={`symptom-${symptom.value}`}
              checked={selectedSymptoms.includes(symptom.value)}
              onCheckedChange={() => onSymptomToggle(symptom.value)}
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
  );
};

export default SymptomSelector;
