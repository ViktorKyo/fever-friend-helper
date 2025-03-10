
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  TemperatureReading, 
  TemperatureUnit, 
  Severity, 
  formatTemperature, 
  getSeverity, 
  getAgeGroup, 
  getSymptomsLabels 
} from '@/lib/feverGuide';
import { ChildProfile } from '@/lib/feverGuide';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  Clock, 
  ThermometerSnowflake, 
  ThermometerSun, 
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { slideUpAnimation } from '@/lib/animations';

interface TemperatureHistoryProps {
  readings: TemperatureReading[];
  childProfile: ChildProfile;
  limit?: number;
}

const TemperatureHistory: React.FC<TemperatureHistoryProps> = ({ 
  readings, 
  childProfile,
  limit 
}) => {
  const sortedReadings = [...readings].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  const displayedReadings = limit 
    ? sortedReadings.slice(0, limit) 
    : sortedReadings;
  
  const showViewAllButton = limit && readings.length > limit;
  
  return (
    <Card className={cn("glass-morphism", slideUpAnimation(300))}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Temperature History
          </div>
          {showViewAllButton && (
            <Link to="/history">
              <Button variant="ghost" size="sm" className="h-7 text-sm gap-1">
                View All <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </CardTitle>
        <CardDescription>
          {readings.length === 0 
            ? "No temperature readings recorded yet"
            : `Last ${displayedReadings.length} of ${readings.length} temperature readings`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {readings.length === 0 ? (
          <div className="text-center py-4">
            <ThermometerSun className="h-10 w-10 mx-auto text-muted-foreground opacity-30" />
            <p className="text-muted-foreground mt-2">
              Temperature readings will appear here once recorded
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedReadings.map((reading) => (
              <TemperatureCard
                key={reading.id}
                reading={reading}
                childProfile={childProfile}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TemperatureCardProps {
  reading: TemperatureReading;
  childProfile: ChildProfile;
}

const TemperatureCard: React.FC<TemperatureCardProps> = ({ reading, childProfile }) => {
  const ageGroup = getAgeGroup(childProfile.birthdate);
  const severity = getSeverity(reading.value, reading.unit, ageGroup);
  const formattedTemp = formatTemperature(reading.value, reading.unit);
  const dateString = format(reading.timestamp, 'PPP');
  const timeString = format(reading.timestamp, 'p');
  const symptomsLabels = getSymptomsLabels(reading.symptoms);
  
  return (
    <div className={cn(
      "p-3 rounded-lg border transition-all",
      severity === 'normal' 
        ? "border-green-200 bg-green-50/50" 
        : severity === 'mild' 
          ? "border-amber-200 bg-amber-50/30" 
          : severity === 'moderate' 
            ? "border-orange-200 bg-orange-50/30" 
            : "border-red-200 bg-red-50/30"
    )}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {severity === 'normal' ? (
            <ThermometerSnowflake className="h-5 w-5 mr-2 text-green-500" />
          ) : severity === 'severe' || severity === 'emergency' ? (
            <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
          ) : (
            <ThermometerSun className="h-5 w-5 mr-2 text-orange-500" />
          )}
          <div>
            <p className="font-medium">{formattedTemp}</p>
            <p className="text-xs text-muted-foreground">
              {dateString} at {timeString}
            </p>
          </div>
        </div>
        
        <Badge variant="outline" className={cn(
          "font-normal",
          severity === 'normal' 
            ? "border-green-200 text-green-700" 
            : severity === 'mild' 
              ? "border-amber-200 text-amber-700" 
              : severity === 'moderate' 
                ? "border-orange-200 text-orange-700" 
                : "border-red-200 text-red-700"
        )}>
          {getSeverityLabel(severity)}
        </Badge>
      </div>
      
      {(symptomsLabels.length > 0 || reading.notes) && (
        <div className="mt-2 pl-7">
          {symptomsLabels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {symptomsLabels.map((label) => (
                <Badge key={label} variant="secondary" className="text-xs font-normal">
                  {label}
                </Badge>
              ))}
            </div>
          )}
          
          {reading.notes && (
            <p className="text-xs text-muted-foreground mt-1">
              {reading.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const getSeverityLabel = (severity: Severity): string => {
  switch (severity) {
    case 'normal': return 'Normal';
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe': return 'Severe';
    case 'emergency': return 'Emergency';
  }
};

export default TemperatureHistory;
