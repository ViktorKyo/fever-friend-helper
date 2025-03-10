
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Stethoscope, 
  Smile, 
  Frown, 
  Thermometer, 
  Droplets, 
  Activity 
} from 'lucide-react';
import { ChildProfile, TemperatureReading, getSymptomsLabels } from '@/lib/feverGuide';
import { cn } from '@/lib/utils';
import { slideUpAnimation } from '@/lib/animations';

interface SymptomTrackerProps {
  childProfile: ChildProfile;
  readings: TemperatureReading[];
}

interface SymptomTrend {
  symptom: string;
  occurrences: number;
  lastSeen: Date | null;
  increasing: boolean;
}

const SymptomTracker: React.FC<SymptomTrackerProps> = ({ childProfile, readings }) => {
  // Get all unique symptoms from readings
  const allSymptoms = new Set<string>();
  readings.forEach(reading => {
    getSymptomsLabels(reading.symptoms).forEach(symptom => {
      allSymptoms.add(symptom);
    });
  });
  
  // Calculate trends for each symptom
  const symptomTrends: SymptomTrend[] = Array.from(allSymptoms).map(symptom => {
    const symptomsWithTimestamps = readings
      .filter(reading => getSymptomsLabels(reading.symptoms).includes(symptom))
      .map(reading => ({ timestamp: reading.timestamp }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const recentReadings = readings
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, Math.min(readings.length, 3));
    
    const recentOccurrences = recentReadings.filter(reading => 
      getSymptomsLabels(reading.symptoms).includes(symptom)
    ).length;
    
    const increasing = recentOccurrences >= Math.ceil(recentReadings.length / 2);
    
    return {
      symptom,
      occurrences: symptomsWithTimestamps.length,
      lastSeen: symptomsWithTimestamps.length > 0 ? symptomsWithTimestamps[0].timestamp : null,
      increasing
    };
  });
  
  // Sort by recency and then by number of occurrences
  const sortedTrends = symptomTrends.sort((a, b) => {
    if (a.lastSeen && b.lastSeen) {
      if (a.lastSeen.getTime() === b.lastSeen.getTime()) {
        return b.occurrences - a.occurrences;
      }
      return b.lastSeen.getTime() - a.lastSeen.getTime();
    }
    if (a.lastSeen) return -1;
    if (b.lastSeen) return 1;
    return 0;
  });
  
  if (sortedTrends.length === 0) {
    return null; // Don't show the component if there are no symptoms
  }
  
  return (
    <Card className={cn("glass-morphism", slideUpAnimation(250))}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Symptom Tracker
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {sortedTrends.slice(0, 4).map((trend) => (
            <SymptomTrendItem key={trend.symptom} trend={trend} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface SymptomTrendItemProps {
  trend: SymptomTrend;
}

const SymptomTrendItem: React.FC<SymptomTrendItemProps> = ({ trend }) => {
  const getSymptomIcon = (symptom: string) => {
    if (symptom.includes('Rash')) return <Droplets className="h-4 w-4" />;
    if (symptom.includes('Vomiting') || symptom.includes('Diarrhea')) return <Frown className="h-4 w-4" />;
    if (symptom.includes('Breathing')) return <Activity className="h-4 w-4" />;
    if (symptom.includes('Headache') || symptom.includes('Throat')) return <Thermometer className="h-4 w-4" />;
    return <Stethoscope className="h-4 w-4" />;
  };
  
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          trend.increasing ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
        )}>
          {getSymptomIcon(trend.symptom)}
        </div>
        <div>
          <p className="font-medium text-sm">{trend.symptom}</p>
          <p className="text-xs text-muted-foreground">
            {trend.lastSeen
              ? `Last recorded ${formatTimeAgo(trend.lastSeen)}`
              : 'Not recently recorded'}
          </p>
        </div>
      </div>
      
      <div className={cn(
        "text-xs font-medium rounded-full px-2 py-0.5",
        trend.increasing
          ? "bg-amber-100 text-amber-700"
          : "bg-green-100 text-green-700"
      )}>
        {trend.increasing ? 'Active' : 'Improving'}
      </div>
    </div>
  );
};

// Helper to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  
  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }
}

export default SymptomTracker;
