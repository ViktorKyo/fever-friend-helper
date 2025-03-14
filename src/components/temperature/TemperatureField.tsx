
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemperatureUnit } from '@/lib/feverGuide';

interface TemperatureFieldProps {
  temperature: string;
  activeUnit: TemperatureUnit;
  onTemperatureChange: (value: string) => void;
  onUnitChange: (value: string) => void;
}

const TemperatureField: React.FC<TemperatureFieldProps> = ({
  temperature,
  activeUnit,
  onTemperatureChange,
  onUnitChange
}) => {
  const getNormalRangeText = (): string => {
    return activeUnit === 'C' 
      ? '36.5°C - 37.5°C' 
      : '97.7°F - 99.5°F';
  };

  return (
    <Tabs 
      defaultValue="C" 
      value={activeUnit} 
      onValueChange={onUnitChange}
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
            onChange={(e) => onTemperatureChange(e.target.value)}
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
            onChange={(e) => onTemperatureChange(e.target.value)}
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
  );
};

export default TemperatureField;
