
import React from "react";
import { Reservation, AdminSettings } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Cake, CalendarIcon } from "lucide-react";
import GoogleCalendarCard from "@/components/admin/GoogleCalendarCard";
import ReservationsList from "@/components/admin/ReservationsList";
import CapacitySettings from "@/components/admin/CapacitySettings";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminContainerProps {
  adminSettings: AdminSettings;
  reservations: Reservation[];
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setAdminSettings: (settings: AdminSettings) => void;
  onRefreshReservations: () => Promise<void>;
  onSettingsUpdated: () => Promise<void>;
}

const AdminContainer: React.FC<AdminContainerProps> = ({
  adminSettings,
  reservations,
  isLoading,
  setIsLoading,
  setAdminSettings,
  onRefreshReservations,
  onSettingsUpdated
}) => {
  const isMobile = useIsMobile();

  return (
    <main className="container mx-auto py-6 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-medium">Gestion des Réservations</h2>
            <p className="text-muted-foreground text-sm">
              Gérez vos réservations et la synchronisation avec Google Calendar.
            </p>
          </div>
          {!isMobile && (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/menu-admin">
                  <BookOpen className="mr-2 h-4 w-4" /> Menu
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/events-admin">
                  <Cake className="mr-2 h-4 w-4" /> Événements
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-primary/10 border-primary/20">
                <Link to="/admin">
                  <CalendarIcon className="mr-2 h-4 w-4" /> Réservations
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-4">
            <GoogleCalendarCard 
              adminSettings={adminSettings}
              isLoading={isLoading}
              onRefreshReservations={onRefreshReservations}
              setIsLoading={setIsLoading}
              setAdminSettings={setAdminSettings}
              onSettingsUpdated={onSettingsUpdated}
            />
          </div>
          
          <div className="md:col-span-2">
            <ReservationsList 
              reservations={reservations} 
              onReservationDeleted={onRefreshReservations}
              onReservationUpdated={onRefreshReservations}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminContainer;
