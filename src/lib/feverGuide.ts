
export type AgeGroup = 'newborn' | 'infant' | 'toddler' | 'child' | 'teen';
export type TemperatureUnit = 'C' | 'F';
export type Severity = 'normal' | 'mild' | 'moderate' | 'severe' | 'emergency';
export type Symptom = 'rash' | 'vomiting' | 'diarrhea' | 'breathing' | 'lethargy' | 'dehydration' | 'headache' | 'soreThroat';

export interface ChildProfile {
  id: string;
  name: string;
  birthdate: Date;
  weight?: number; // in kg
  existingConditions?: string[];
  medications?: string[];
}

export interface Temperature {
  value: number;
  unit: TemperatureUnit;
  timestamp: Date;
  symptoms: Symptom[];
  notes?: string;
}

export interface TemperatureReading extends Temperature {
  childId: string;
  id: string;
}

export const getAgeGroup = (birthdate: Date): AgeGroup => {
  const ageInMonths = getAgeInMonths(birthdate);
  
  if (ageInMonths < 3) return 'newborn';
  if (ageInMonths < 12) return 'infant';
  if (ageInMonths < 36) return 'toddler';
  if (ageInMonths < 144) return 'child'; // 12 years
  return 'teen';
};

export const getAgeInMonths = (birthdate: Date): number => {
  const today = new Date();
  let months = (today.getFullYear() - birthdate.getFullYear()) * 12;
  months -= birthdate.getMonth();
  months += today.getMonth();
  return months;
};

export const convertTemperature = (temp: number, from: TemperatureUnit, to: TemperatureUnit): number => {
  if (from === to) return temp;
  
  if (from === 'C' && to === 'F') {
    return (temp * 9/5) + 32;
  } else {
    return (temp - 32) * 5/9;
  }
};

export const getSeverity = (temp: number, unit: TemperatureUnit, ageGroup: AgeGroup): Severity => {
  // Convert to Celsius for standardized evaluation
  const tempInC = unit === 'C' ? temp : convertTemperature(temp, 'F', 'C');
  
  switch(ageGroup) {
    case 'newborn':
      if (tempInC < 36) return 'emergency';
      if (tempInC < 36.5) return 'moderate';
      if (tempInC > 38) return 'emergency';
      if (tempInC >= 37.5) return 'moderate';
      return 'normal';
      
    case 'infant':
      if (tempInC < 36) return 'severe';
      if (tempInC < 36.5) return 'moderate';
      if (tempInC >= 39) return 'severe';
      if (tempInC >= 38) return 'moderate';
      if (tempInC >= 37.5) return 'mild';
      return 'normal';
      
    case 'toddler':
    case 'child':
      if (tempInC < 36) return 'severe';
      if (tempInC < 36.5) return 'moderate';
      if (tempInC >= 40) return 'severe';
      if (tempInC >= 39) return 'moderate';
      if (tempInC >= 38) return 'mild';
      return 'normal';
      
    case 'teen':
      if (tempInC < 36) return 'severe';
      if (tempInC < 36.5) return 'mild';
      if (tempInC >= 40) return 'severe';
      if (tempInC >= 39) return 'moderate';
      if (tempInC >= 38) return 'mild';
      return 'normal';
  }
};

export const getAdvice = (
  temp: number,
  unit: TemperatureUnit,
  ageGroup: AgeGroup,
  symptoms: Symptom[] = []
): { advice: string; callDoctor: boolean; goToER: boolean } => {
  const severity = getSeverity(temp, unit, ageGroup);
  const hasWorryingSymptoms = symptoms.some(s => 
    ['breathing', 'lethargy', 'dehydration'].includes(s)
  );
  
  // For newborns, any fever is an emergency
  if (ageGroup === 'newborn' && severity !== 'normal') {
    return {
      advice: "For newborns under 3 months, any fever requires immediate medical attention. Go to the emergency room now.",
      callDoctor: false,
      goToER: true
    };
  }
  
  // Emergency cases
  if (severity === 'emergency' || (severity === 'severe' && hasWorryingSymptoms)) {
    return {
      advice: "This is a medical emergency. Go to the emergency room immediately.",
      callDoctor: false,
      goToER: true
    };
  }
  
  // Severe cases
  if (severity === 'severe') {
    return {
      advice: "This is a high fever. Call your doctor immediately for guidance. If you can't reach your doctor, consider going to the emergency room, especially if the child appears very ill.",
      callDoctor: true,
      goToER: false
    };
  }
  
  // Moderate cases with worrying symptoms
  if (severity === 'moderate' && hasWorryingSymptoms) {
    return {
      advice: "Call your doctor right away. The fever combined with these symptoms needs medical attention.",
      callDoctor: true,
      goToER: false
    };
  }
  
  // Moderate cases
  if (severity === 'moderate') {
    return {
      advice: "Monitor the fever closely. Give appropriate dose of fever-reducing medication if the child is uncomfortable. Ensure they drink plenty of fluids. Call your doctor if the fever persists for more than 24 hours or if the child's condition worsens.",
      callDoctor: false,
      goToER: false
    };
  }
  
  // Mild cases with some concerning symptoms
  if (severity === 'mild' && symptoms.length > 0) {
    return {
      advice: "Give appropriate dose of fever-reducing medication if needed. Keep the child hydrated. Monitor for changes. Call your doctor if symptoms worsen or fever persists for more than 2-3 days.",
      callDoctor: false,
      goToER: false
    };
  }
  
  // Mild cases
  if (severity === 'mild') {
    return {
      advice: "This is a low-grade fever. Keep the child comfortable and ensure they drink plenty of fluids. Monitor for changes. Fever-reducing medication is optional if the child is otherwise comfortable.",
      callDoctor: false,
      goToER: false
    };
  }
  
  // Normal temperatures
  return {
    advice: "This temperature is within the normal range. Continue to monitor if the child is showing symptoms of illness.",
    callDoctor: false,
    goToER: false
  };
};

export const getMedicationDosage = (weight: number, medication: 'acetaminophen' | 'ibuprofen'): string => {
  if (!weight) return "Consult your doctor for proper dosing.";
  
  if (medication === 'acetaminophen') {
    // 10-15 mg per kg every 4-6 hours
    const lowDose = Math.round(weight * 10);
    const highDose = Math.round(weight * 15);
    return `${lowDose}-${highDose} mg every 4-6 hours (not to exceed 5 doses in 24 hours)`;
  } else {
    // 5-10 mg per kg every 6-8 hours
    const lowDose = Math.round(weight * 5);
    const highDose = Math.round(weight * 10);
    return `${lowDose}-${highDose} mg every 6-8 hours`;
  }
};

export const formatTemperature = (temp: number, unit: TemperatureUnit): string => {
  return `${temp.toFixed(1)}°${unit}`;
};

export const getSeverityColor = (severity: Severity): string => {
  switch(severity) {
    case 'normal': return 'text-green-500';
    case 'mild': return 'text-fever-accent';
    case 'moderate': return 'text-orange-500';
    case 'severe':
    case 'emergency': return 'text-destructive';
  }
};

export const getSymptomsLabels = (symptoms: Symptom[]): string[] => {
  const labels: Record<Symptom, string> = {
    rash: 'Rash',
    vomiting: 'Vomiting',
    diarrhea: 'Diarrhea',
    breathing: 'Difficulty Breathing',
    lethargy: 'Unusual Sleepiness',
    dehydration: 'Signs of Dehydration',
    headache: 'Headache',
    soreThroat: 'Sore Throat'
  };
  
  return symptoms.map(s => labels[s]);
};

// Helper to generate a mock reading history for development
export const generateMockReadings = (childId: string, count = 5): TemperatureReading[] => {
  const readings: TemperatureReading[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (i * 6 * 60 * 60 * 1000)); // 6 hours apart
    readings.push({
      id: `reading-${i}`,
      childId,
      value: 37 + (Math.random() * 2 - 0.5), // Random between 36.5 and 38.5
      unit: 'C',
      timestamp,
      symptoms: i % 2 === 0 ? ['headache'] : [],
      notes: i === 0 ? 'First reading after noticing warm forehead' : undefined
    });
  }
  
  return readings;
};
