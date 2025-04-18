
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Reservation } from "@/types";
import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { ReservationService } from "@/services/ReservationService";
import { AuthService } from "@/services/AuthService";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useLoadingState } from "@/hooks/useLoadingState";

// Import components
import AdminHeader from "@/components/admin/AdminHeader";
import AdminContainer from "@/components/admin/AdminContainer";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";

const Admin = () => {
  const location = useLocation();
  const { 
    adminSettings, 
    setAdminSettings, 
    loadAdminSettings, 
    updateGoogleSettings 
  } = useAdminSettings();
  
  const { isLoading, startLoading, stopLoading, withLoading } = useLoadingState();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const loadReservations = async () => {
    setError(null);
    try {
      const reservationsData = await ReservationService.getReservations();
      setReservations(reservationsData);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      setError("Impossible de charger les réservations. Veuillez réessayer plus tard.");
    }
  };
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authStatus = queryParams.get('auth');
    
    if (authStatus === 'success') {
      const handleAuthSuccess = async () => {
        try {
          startLoading();
          const session = await AuthService.getSession();
          
          if (session) {
            const updated = await updateGoogleSettings(session);
            if (updated) {
              await loadReservations();
            }
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour des paramètres:", error);
          toast.error("Erreur de connexion", {
            description: "Une erreur est survenue lors de la mise à jour des paramètres."
          });
          setError("Erreur lors de la connexion à Google. Veuillez réessayer.");
        } finally {
          stopLoading();
          // Nettoyer l'URL
          window.history.replaceState({}, document.title, location.pathname);
        }
      };
      
      handleAuthSuccess();
    }
    
    const loadData = async () => {
      await withLoading(async () => {
        try {
          await loadReservations();
          await loadAdminSettings();
          await GoogleCalendarService.isConnected();
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
          toast.error("Erreur de chargement", {
            description: "Impossible de charger les données."
          });
          setError("Impossible de charger les données. Veuillez réessayer.");
        }
      });
    };
    
    loadData();
    
    const subscription = AuthService.setupAuthListener();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location]);
  
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <AdminHeader />
        {error && (
          <div className="container mx-auto py-4 px-4">
            <ApiErrorAlert 
              title="Erreur de chargement" 
              description={error}
            />
          </div>
        )}
        <AdminContainer 
          adminSettings={adminSettings}
          reservations={reservations}
          isLoading={isLoading}
          setIsLoading={startLoading}
          setAdminSettings={setAdminSettings}
          onRefreshReservations={loadReservations}
          onSettingsUpdated={loadAdminSettings}
        />
      </ErrorBoundary>
    </div>
  );
};

export default Admin;
