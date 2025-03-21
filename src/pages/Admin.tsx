
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Reservation } from "@/types";
import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { ReservationService } from "@/services/ReservationService";
import { AuthService } from "@/services/AuthService";
import { useAdminSettings } from "@/hooks/useAdminSettings";

// Import components
import AdminHeader from "@/components/admin/AdminHeader";
import AdminContainer from "@/components/admin/AdminContainer";

const Admin = () => {
  const location = useLocation();
  const { 
    adminSettings, 
    setAdminSettings, 
    isLoading, 
    setIsLoading, 
    loadAdminSettings, 
    updateGoogleSettings 
  } = useAdminSettings();
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  const loadReservations = async () => {
    try {
      const reservationsData = await ReservationService.getReservations();
      setReservations(reservationsData);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    }
  };
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authStatus = queryParams.get('auth');
    
    if (authStatus === 'success') {
      console.log('Auth success détecté, mise à jour des paramètres admin...');
      
      const handleAuthSuccess = async () => {
        try {
          setIsLoading(true);
          const session = await AuthService.getSession();
          
          console.log('Session récupérée:', session ? 'Valide' : 'Invalide');
          
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
        } finally {
          setIsLoading(false);
          window.history.replaceState({}, document.title, location.pathname);
        }
      };
      
      handleAuthSuccess();
    }
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log('Chargement des données initiales...');
        await loadReservations();
        await loadAdminSettings();
        
        const isConnected = await GoogleCalendarService.isConnected();
        console.log('État de la connexion Google:', isConnected ? 'Connecté' : 'Déconnecté');
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur de chargement", {
          description: "Impossible de charger les données."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    const subscription = AuthService.setupAuthListener();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location]);
  
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <AdminContainer 
        adminSettings={adminSettings}
        reservations={reservations}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setAdminSettings={setAdminSettings}
        onRefreshReservations={loadReservations}
        onSettingsUpdated={loadAdminSettings}
      />
    </div>
  );
};

export default Admin;
