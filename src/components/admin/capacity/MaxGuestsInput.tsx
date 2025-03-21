
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MaxGuestsInputProps {
  maxGuestsPerDay: number;
  onMaxGuestsChange: (value: number) => void;
}

const MaxGuestsInput: React.FC<MaxGuestsInputProps> = ({ maxGuestsPerDay, onMaxGuestsChange }) => {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="maxGuests">Nombre maximum de personnes par jour</Label>
      <Input
        id="maxGuests"
        type="number"
        value={maxGuestsPerDay}
        onChange={(e) => onMaxGuestsChange(Number(e.target.value))}
        className="w-24 text-right"
        min={1}
      />
    </div>
  );
};

export default MaxGuestsInput;
