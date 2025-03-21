
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Trash } from "lucide-react";

interface TimeSlotItemProps {
  slot: string;
  onRemove: (slot: string) => void;
}

const TimeSlotItem: React.FC<TimeSlotItemProps> = ({ slot, onRemove }) => {
  return (
    <div className="flex items-center bg-muted rounded-md px-3 py-1">
      <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
      <span className="text-sm">{slot}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 ml-1.5 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(slot)}
      >
        <Trash className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default TimeSlotItem;
