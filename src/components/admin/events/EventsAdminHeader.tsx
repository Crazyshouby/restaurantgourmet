
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EventsAdminHeaderProps {
  title: string;
  description?: string;
}

const EventsAdminHeader: React.FC<EventsAdminHeaderProps> = ({
  title,
  description
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h2 className="text-2xl font-medium">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      <div className="space-x-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin">Retour</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/events" target="_blank">Voir les événements</Link>
        </Button>
      </div>
    </div>
  );
};

export default EventsAdminHeader;
