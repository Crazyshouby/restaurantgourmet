
import React from "react";

const EmptyReservationState: React.FC = () => {
  return (
    <div className="text-center py-6 text-muted-foreground" aria-live="polite">
      Aucune réservation pour le moment
    </div>
  );
};

export default EmptyReservationState;
