
import React from "react";
import { Reservation, AdminSettings } from "@/types";
import GoogleCalendarCard from "@/components/admin/GoogleCalendarCard";
import ReservationsList from "@/components/admin/ReservationsList";
import CapacitySettings from "@/components/admin/CapacitySettings";

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
  return (
    <main className="container mx-auto py-6 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-medium">Administration</h2>
          <p className="text-muted-foreground text-sm">
            Gérez vos réservations et la synchronisation avec Google Calendar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-4">
            {/* Google Calendar Card placed first (at the top) */}
            <GoogleCalendarCard 
              adminSettings={adminSettings}
              isLoading={isLoading}
              onRefreshReservations={onRefreshReservations}
              setIsLoading={setIsLoading}
              setAdminSettings={setAdminSettings}
            />
            
            {/* Capacity Settings placed second (below Google Calendar) */}
            <CapacitySettings 
              adminSettings={adminSettings}
              onSettingsUpdated={onSettingsUpdated}
              isLoading={isLoading}
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
