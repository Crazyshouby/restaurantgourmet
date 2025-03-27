
import React, { useState, useEffect } from "react";
import { Clock as ClockIcon } from "lucide-react";

export function Clock() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Format date as: DD/MM/YYYY
  const formattedDate = dateTime.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // Format time as: HH:MM:SS
  const formattedTime = dateTime.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  return (
    <div className="flex items-center gap-2 text-sm bg-muted/40 px-3 py-1.5 rounded-md">
      <ClockIcon className="h-4 w-4" />
      <span>
        {formattedDate} - {formattedTime}
      </span>
    </div>
  );
}
