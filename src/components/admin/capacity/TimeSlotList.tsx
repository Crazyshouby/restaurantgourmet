
import React from "react";
import { Label } from "@/components/ui/label";
import TimeSlotItem from "./TimeSlotItem";

interface TimeSlotListProps {
  timeSlots: string[];
  onRemoveTimeSlot: (slot: string) => void;
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({ timeSlots, onRemoveTimeSlot }) => {
  return (
    <div className="space-y-2">
      <Label>Plages horaires disponibles</Label>
      <div className="flex flex-wrap gap-2">
        {timeSlots.map((slot) => (
          <TimeSlotItem 
            key={slot} 
            slot={slot} 
            onRemove={onRemoveTimeSlot} 
          />
        ))}
      </div>
    </div>
  );
};

export default TimeSlotList;
