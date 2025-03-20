import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CalendarClock, Check, ExternalLink, RefreshCw, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AdminSettings } from "@/types";
import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { ReservationService } from "@/services/ReservationService";
import { Reservation } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const GoogleIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    <path d="M17.8 12.2H12v3.186h3.357c-.31 1.636-1.747 2.814-3.357 2.814-1.933 0-3.5-1.568-3.5-3.5s1.567-3.5 3.5-3.5c.884 0 1.69.334 2.304.876l2.234-2.234C15.137 8.557 13.646 8 12 8c-3.314 0-6 2.686-6 6s2.686 6 6 6c3.052 0 5.686-2.184 6.255-5.218.17-.916.1-2.046-.455-2.582z" />
  </svg>
);

const Admin = () => {
  const location = useLocation();
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    googleConnected: false,
    googleEmail: undefined,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authStatus = queryParams.get('auth');
    
    if (authStatus === 'success') {
      const updateAdminSettings = async () => {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const session = sessionData.session;
          
          if (session?.provider_token && session?.user?.email) {
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
              setAdminSettings({
                googleConnected: true,
                googleEmail: session.user.email,
                googleRefreshToken: session.refresh_token
              });
              
              toast.success("Connexion Google réussie", {
                description: "Votre compte Google a été connecté avec succès."
              });
            }
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour des paramètres:", error);
        }
        
        window.history.replaceState({}, document.title, location.pathname);
      };
      
      updateAdminSettings();
    }
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const reservationsData = await ReservationService.getReservations();
        setReservations(reservationsData);
        
        const isConnected = await GoogleCalendarService.isConnected();
        if (isConnected) {
          const { data, error } = await supabase
            .from('admin_settings')
            .select('*')
            .eq('id', 1)
            .single();
          
          if (!error && data) {
            setAdminSettings({
              googleConnected: data.google_connected,
              googleEmail: data.google_email,
              googleRefreshToken: data.google_refresh_token
            });
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location]);
  
  const handleGoogleConnect = async () => {
    setIsLoading(true);
    
    try {
      await GoogleCalendarService.connect();
    } catch (error) {
      console.error("Erreur lors de la connexion à Google:", error);
      toast.error("Erreur de connexion", {
        description: "Une erreur est survenue. Veuillez réessayer."
      });
      setIsLoading(false);
    }
  };
  
  const handleGoogleDisconnect = async () => {
    setIsLoading(true);
    
    try {
      const result = await GoogleCalendarService.disconnect();
      
      if (result.success) {
        setAdminSettings({
          googleConnected: false,
          googleEmail: undefined,
          googleRefreshToken: undefined
        });
        
        toast.info("Compte Google déconnecté", {
          description: "La synchronisation est désactivée."
        });
      } else {
        toast.error("Erreur de déconnexion", {
          description: "Impossible de déconnecter le compte Google."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion de Google:", error);
      toast.error("Erreur de déconnexion", {
        description: "Une erreur est survenue. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const syncNow = async () => {
    setIsLoading(true);
    
    try {
      const result = await ReservationService.syncWithGoogleCalendar();
      
      if (result.success) {
        toast.success("Synchronisation terminée", {
          description: `${result.syncedCount} réservation(s) synchronisée(s) avec Google Calendar.`
        });
        
        const updatedReservations = await ReservationService.getReservations();
        setReservations(updatedReservations);
      } else {
        toast.error("Erreur de synchronisation", {
          description: "Impossible de synchroniser avec Google Calendar."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
      toast.error("Erreur de synchronisation", {
        description: "Une erreur est survenue. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-medium">Reserv</h1>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Accueil
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4 animate-fade-in">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-medium">Administration</h2>
            <p className="text-muted-foreground">
              Gérez vos réservations et la synchronisation avec Google Calendar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="shadow-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GoogleIcon />
                    Google Calendar
                  </CardTitle>
                  <CardDescription>
                    Synchronisez vos réservations avec Google Calendar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="google-sync">Synchronisation</Label>
                    <Switch 
                      id="google-sync" 
                      checked={adminSettings.googleConnected}
                      disabled={isLoading}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleGoogleConnect();
                        } else {
                          handleGoogleDisconnect();
                        }
                      }}
                    />
                  </div>
                  
                  {adminSettings.googleConnected && (
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <div className="font-medium mb-1">Compte connecté :</div>
                      <div className="text-muted-foreground mb-2">{adminSettings.googleEmail}</div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={syncNow}
                        disabled={isLoading}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Synchroniser maintenant
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  {adminSettings.googleConnected ? (
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-600" />
                      Les réservations sont automatiquement synchronisées
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <X className="h-3 w-3 text-red-600" />
                      Synchronisation Google Calendar désactivée
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5" />
                    Réservations récentes
                  </CardTitle>
                  <CardDescription>
                    Aperçu des dernières réservations effectuées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reservations.length > 0 ? (
                    <div className="space-y-3">
                      {reservations.map((reservation) => (
                        <div 
                          key={reservation.id} 
                          className="flex items-center justify-between p-3 rounded-md border"
                        >
                          <div>
                            <h4 className="font-medium">{reservation.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              {new Date(reservation.date).toLocaleDateString()} à {reservation.time}
                              {' • '}{reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {reservation.email} • {reservation.phone}
                            </div>
                          </div>
                          <div>
                            {reservation.googleEventId ? (
                              <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
                                <Check className="h-3 w-3" />
                                Synchronisé
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="flex items-center gap-1 bg-amber-50">
                                <RefreshCw className="h-3 w-3" />
                                En attente
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      Aucune réservation pour le moment
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
