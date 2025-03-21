
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AdminSettings } from "@/types";
import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { ReservationService } from "@/services/ReservationService";
import { Reservation } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Import the refactored components
import GoogleCalendarCard from "@/components/admin/GoogleCalendarCard";
import ReservationsList from "@/components/admin/ReservationsList";
import AdminHeader from "@/components/admin/AdminHeader";
import CapacitySettings from "@/components/admin/CapacitySettings";

const Admin = () => {
  const location = useLocation();
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    googleConnected: false,
    googleEmail: undefined,
    timeSlots: [],
    maxGuestsPerDay: 20
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  const loadReservations = async () => {
    try {
      const reservationsData = await ReservationService.getReservations();
      setReservations(reservationsData);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    }
  };
  
  const loadAdminSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (!error && data) {
        console.log('Paramètres admin chargés:', data);
        setAdminSettings({
          googleConnected: data.google_connected,
          googleEmail: data.google_email,
          googleRefreshToken: data.google_refresh_token,
          timeSlots: data.time_slots || [],
          maxGuestsPerDay: data.max_guests_per_day || 20
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres admin:", error);
    }
  };
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authStatus = queryParams.get('auth');
    
    if (authStatus === 'success') {
      console.log('Auth success détecté, mise à jour des paramètres admin...');
      
      const updateAdminSettings = async () => {
        try {
          setIsLoading(true);
          const { data: sessionData } = await supabase.auth.getSession();
          const session = sessionData.session;
          
          console.log('Session récupérée:', session ? 'Valide' : 'Invalide');
          
          if (session?.provider_token && session?.user?.email) {
            console.log('Mise à jour des paramètres avec email:', session.user.email);
            
            const { error } = await supabase
              .from('admin_settings')
              .update({
                google_connected: true,
                google_refresh_token: session.refresh_token,
                google_email: session.user.email,
                updated_at: new Date().toISOString()
              })
              .eq('id', 1);
            
            if (!error) {
              setAdminSettings(prevSettings => ({
                ...prevSettings,
                googleConnected: true,
                googleEmail: session.user.email,
                googleRefreshToken: session.refresh_token
              }));
              
              toast.success("Connexion Google réussie", {
                description: "Votre compte Google a été connecté avec succès."
              });
              
              console.log('Paramètres mis à jour avec succès');
              await loadReservations();
            } else {
              console.error('Erreur lors de la mise à jour dans Supabase:', error);
              toast.error("Erreur de connexion", {
                description: "Impossible de mettre à jour les paramètres."
              });
            }
          } else {
            console.warn('Session valide mais provider_token ou email manquant');
            toast.error("Erreur de connexion", {
              description: "Informations de session incomplètes."
            });
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
      
      updateAdminSettings();
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
    
    console.log('Configuration du listener pour l\'authentification...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.provider_token) {
          console.log('Utilisateur connecté avec un provider_token');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location]);
  
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
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
                onRefreshReservations={loadReservations}
                setIsLoading={setIsLoading}
                setAdminSettings={setAdminSettings}
              />
              
              {/* Capacity Settings placed second (below Google Calendar) */}
              <CapacitySettings 
                adminSettings={adminSettings}
                onSettingsUpdated={loadAdminSettings}
                isLoading={isLoading}
              />
            </div>
            
            <div className="md:col-span-2">
              <ReservationsList 
                reservations={reservations} 
                onReservationDeleted={loadReservations}
                onReservationUpdated={loadReservations}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
