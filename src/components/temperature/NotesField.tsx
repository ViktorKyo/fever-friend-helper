
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesFieldProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

const NotesField: React.FC<NotesFieldProps> = ({ notes, onNotesChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes" className="font-medium">Notes <span className="text-muted-foreground text-xs">(Optional)</span></Label>
      <Textarea 
        id="notes"
        placeholder="Any additional observations..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="resize-none input-focus-ring"
      />
    </div>
  );
};

export default NotesField;
