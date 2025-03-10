
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AgeGroup, 
  Severity, 
  Symptom, 
  Temperature, 
  TemperatureUnit, 
  formatTemperature, 
  getAdvice, 
  getAgeGroup, 
  getMedicationDosage, 
  getSeverity, 
  getSeverityColor 
} from '@/lib/feverGuide';
import { 
  AlertTriangle, 
  Phone, 
  ThermometerSnowflake, 
  ThermometerSun, 
  Stethoscope, 
  Pill 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChildProfile } from '@/lib/feverGuide';
import { cn } from '@/lib/utils';
import { slideUpAnimation } from '@/lib/animations';

interface AdviceDisplayProps {
  temperature: Temperature;
  childProfile: ChildProfile;
}

const AdviceDisplay: React.FC<AdviceDisplayProps> = ({ temperature, childProfile }) => {
  const ageGroup = getAgeGroup(childProfile.birthdate);
  const severity = getSeverity(temperature.value, temperature.unit, ageGroup);
  const advice = getAdvice(temperature.value, temperature.unit, ageGroup, temperature.symptoms);
  
  return (
    <Card className={cn(
      "glass-morphism overflow-hidden transition-all duration-300 border-x-0 border-b-0",
      slideUpAnimation(200)
    )}>
      <div className={cn(
        "h-2 w-full", 
        severity === 'normal' 
          ? "bg-green-500" 
          : severity === 'mild' 
            ? "bg-fever-accent" 
            : severity === 'moderate' 
              ? "bg-orange-500" 
              : "bg-destructive"
      )} />
      
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            {severity === 'normal' ? (
              <ThermometerSnowflake className="h-5 w-5 mr-2 text-green-500" />
            ) : severity === 'severe' || severity === 'emergency' ? (
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
            ) : (
              <ThermometerSun className="h-5 w-5 mr-2 text-fever-accent" />
            )}
            Assessment
          </div>
          <div className={cn("text-base font-normal", getSeverityColor(severity))}>
            {formatTemperature(temperature.value, temperature.unit)} - {formatSeverity(severity)}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4">
        <p className="text-foreground">{advice.advice}</p>
        
        {(advice.callDoctor || advice.goToER) && (
          <div className={cn(
            "p-3 rounded-lg text-white flex items-start space-x-3",
            advice.goToER ? "bg-destructive" : "bg-orange-500"
          )}>
            {advice.goToER ? (
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            ) : (
              <Phone className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">
                {advice.goToER 
                  ? "Seek emergency care immediately" 
                  : "Contact your healthcare provider"
                }
              </p>
              <p className="text-sm opacity-90 mt-1">
                {advice.goToER 
                  ? "This temperature reading requires immediate medical attention." 
                  : "Describe the symptoms and follow their guidance."
                }
              </p>
            </div>
          </div>
        )}
        
        {severity !== 'normal' && childProfile.weight && (
          <MedicationAdvice 
            weight={childProfile.weight} 
            ageGroup={ageGroup}
          />
        )}
      </CardContent>
    </Card>
  );
};

interface MedicationAdviceProps {
  weight: number;
  ageGroup: AgeGroup;
}

const MedicationAdvice: React.FC<MedicationAdviceProps> = ({ weight, ageGroup }) => {
  // Only show medication advice for infants (3mo+) and older
  if (ageGroup === 'newborn') {
    return (
      <div className="rounded-lg border p-3 bg-muted/50">
        <div className="flex items-center space-x-2 text-muted-foreground mb-2">
          <Stethoscope className="h-4 w-4" />
          <p className="font-medium text-sm">Medical Guidance</p>
        </div>
        <p className="text-sm">
          For infants under 3 months, do not give fever-reducing medications without consulting a healthcare provider first.
        </p>
      </div>
    );
  }
  
  const acetaminophenDose = getMedicationDosage(weight, 'acetaminophen');
  const ibuprofenDose = getMedicationDosage(weight, 'ibuprofen');
  
  // Ibuprofen isn't recommended for infants under 6 months
  const canUseIbuprofen = ageGroup !== 'infant' || getAgeInMonths(ageGroup) >= 6;
  
  return (
    <div className="rounded-lg border p-3 bg-muted/50">
      <div className="flex items-center space-x-2 text-muted-foreground mb-2">
        <Pill className="h-4 w-4" />
        <p className="font-medium text-sm">Medication Guidance</p>
      </div>
      
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium">Acetaminophen (Tylenol):</p>
          <p>{acetaminophenDose}</p>
        </div>
        
        {canUseIbuprofen ? (
          <div>
            <p className="font-medium">Ibuprofen (Motrin, Advil):</p>
            <p>{ibuprofenDose}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Ibuprofen is not recommended for infants under 6 months of age.
          </p>
        )}
        
        <p className="text-xs text-muted-foreground mt-2">
          Always follow the dosing instructions on the medication packaging and consult your healthcare provider before giving any medication.
        </p>
      </div>
    </div>
  );
};

// Helper function to format severity level for display
const formatSeverity = (severity: Severity): string => {
  switch (severity) {
    case 'normal': return 'Normal';
    case 'mild': return 'Mild Fever';
    case 'moderate': return 'Moderate Fever';
    case 'severe': return 'High Fever';
    case 'emergency': return 'Medical Emergency';
  }
};

// Helper function to get age in months from age group
const getAgeInMonths = (ageGroup: AgeGroup): number => {
  switch (ageGroup) {
    case 'newborn': return 0;
    case 'infant': return 3;
    case 'toddler': return 12;
    case 'child': return 36;
    case 'teen': return 144;
  }
};

export default AdviceDisplay;
