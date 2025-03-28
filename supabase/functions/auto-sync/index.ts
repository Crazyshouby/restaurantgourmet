
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../google-auth/config.ts";

// Configuration
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";

// Client Supabase avec le rôle de service pour accéder aux données protégées
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Types utiles
interface AdminSettings {
  google_connected: boolean;
  google_refresh_token: string | null;
  google_email: string | null;
  last_sync_timestamp?: string;
}

interface Reservation {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  phone: string;
  email: string;
  notes?: string;
  google_event_id: string | null;
  imported_from_google: boolean;
}

// Format d'un événement pour Google Calendar
interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

// Fonction pour enregistrer un log dans la base de données
async function logSyncActivity(message: string, type: "info" | "error" | "success", details?: any) {
  try {
    console.log(`[${type.toUpperCase()}] ${message}`, details || "");

    const { error } = await supabase
      .from("sync_logs")
      .insert({
        message,
        log_type: type,
        details: details ? JSON.stringify(details) : null,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error("Erreur lors de l'enregistrement du log:", error);
    }
  } catch (err) {
    console.error("Exception lors de l'enregistrement du log:", err);
  }
}

// Fonction pour rafraîchir un token d'accès
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    await logSyncActivity("Rafraîchissement du token d'accès...", "info");
    
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    
    const tokenData = await tokenRes.json();
    
    if (!tokenData.access_token) {
      await logSyncActivity("Échec du rafraîchissement du token", "error", tokenData);
      return null;
    }
    
    await logSyncActivity("Token d'accès rafraîchi avec succès", "success");
    return tokenData.access_token;
  } catch (error) {
    await logSyncActivity("Erreur lors du rafraîchissement du token", "error", error);
    return null;
  }
}

// Fonction pour formater une date et une heure pour Google Calendar
function formatDateTimeForCalendar(date: string, time: string): string {
  return `${date}T${time}:00`;
}

// Fonction pour calculer l'heure de fin (ajoute 1h30 par défaut)
function calculateEndTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  let endHours = hours + 1;
  let endMinutes = minutes + 30;
  
  if (endMinutes >= 60) {
    endHours += 1;
    endMinutes -= 60;
  }
  
  if (endHours >= 24) {
    endHours -= 24;
  }
  
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:00`;
}

// Fonction pour créer un événement dans Google Calendar
async function createCalendarEvent(reservation: Reservation, accessToken: string): Promise<string | null> {
  try {
    await logSyncActivity(`Création d'un événement pour ${reservation.name} le ${reservation.date} à ${reservation.time}`, "info");
    
    // Format des dates pour Google Calendar
    const startDateTime = formatDateTimeForCalendar(reservation.date, reservation.time);
    const endDateTime = formatDateTimeForCalendar(reservation.date, calculateEndTime(reservation.time));
    
    const event: CalendarEvent = {
      summary: `Réservation: ${reservation.name}`,
      description: `Réservation pour ${reservation.guests} personne(s)\nTél: ${reservation.phone}\nEmail: ${reservation.email}\nNotes: ${reservation.notes || "Aucune"}`,
      start: {
        dateTime: startDateTime,
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/New_York',
      },
    };
    
    // Appel à l'API Google Calendar
    const calendarRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    
    const calendarData = await calendarRes.json();
    
    if (!calendarData.id) {
      await logSyncActivity("Échec de la création de l'événement", "error", calendarData);
      return null;
    }
    
    await logSyncActivity(`Événement créé avec succès, ID: ${calendarData.id}`, "success");
    return calendarData.id;
  } catch (error) {
    await logSyncActivity("Erreur lors de la création de l'événement", "error", error);
    return null;
  }
}

// Point d'entrée principal
async function autoSync(): Promise<{ success: boolean; syncedCount: number; message: string }> {
  try {
    await logSyncActivity("Démarrage de la synchronisation automatique...", "info");
    
    // Récupération des paramètres admin
    const { data: adminSettings, error: adminError } = await supabase
      .from("admin_settings")
      .select("google_connected, google_refresh_token, google_email, last_sync_timestamp")
      .eq("id", 1)
      .single();
    
    if (adminError || !adminSettings) {
      const errorMessage = `Erreur lors de la récupération des paramètres admin: ${adminError?.message || "données non trouvées"}`;
      await logSyncActivity(errorMessage, "error");
      return { 
        success: false, 
        syncedCount: 0, 
        message: errorMessage
      };
    }
    
    // Vérification de la connexion Google
    if (!adminSettings.google_connected || !adminSettings.google_refresh_token) {
      await logSyncActivity("Google Calendar n'est pas connecté ou le refresh token est absent", "error");
      return { 
        success: false, 
        syncedCount: 0, 
        message: "Google Calendar n'est pas connecté ou le refresh token est absent" 
      };
    }
    
    // Récupération d'un access token valide
    const accessToken = await refreshAccessToken(adminSettings.google_refresh_token);
    
    if (!accessToken) {
      // Marquer la connexion comme invalide dans admin_settings
      await supabase
        .from("admin_settings")
        .update({
          google_connected: false,
          sync_error: "Refresh token invalide ou révoqué"
        })
        .eq("id", 1);
      
      await logSyncActivity("Impossible d'obtenir un token d'accès valide, la connexion a été marquée comme invalide", "error");
        
      return { 
        success: false, 
        syncedCount: 0, 
        message: "Impossible d'obtenir un token d'accès valide, la connexion a été marquée comme invalide" 
      };
    }
    
    // Détermination de la dernière synchronisation
    const lastSyncTimestamp = adminSettings.last_sync_timestamp 
      ? new Date(adminSettings.last_sync_timestamp) 
      : new Date(0); // 1970-01-01 si jamais synchronisé
      
    await logSyncActivity(`Dernière synchronisation: ${lastSyncTimestamp.toISOString()}`, "info");
    
    // Récupération des réservations non synchronisées
    const query = supabase
      .from("reservations")
      .select("*")
      .is("google_event_id", null)
      .eq("imported_from_google", false);
      
    // Si nous avons un timestamp de dernière synchro, ne prendre que les réservations plus récentes
    if (adminSettings.last_sync_timestamp) {
      query.gte("created_at", adminSettings.last_sync_timestamp);
    }
    
    const { data: reservations, error: reservationsError } = await query;
    
    if (reservationsError) {
      const errorMessage = `Erreur lors de la récupération des réservations: ${reservationsError.message}`;
      await logSyncActivity(errorMessage, "error");
      return { 
        success: false, 
        syncedCount: 0, 
        message: errorMessage
      };
    }
    
    await logSyncActivity(`${reservations.length} réservation(s) à synchroniser`, "info");
    
    if (reservations.length === 0) {
      // Mettre à jour seulement le timestamp de synchronisation
      await supabase
        .from("admin_settings")
        .update({
          last_sync_timestamp: new Date().toISOString(),
          last_sync_status: "success",
          sync_error: null
        })
        .eq("id", 1);
      
      await logSyncActivity("Aucune nouvelle réservation à synchroniser", "success");
        
      return { 
        success: true, 
        syncedCount: 0, 
        message: "Aucune nouvelle réservation à synchroniser" 
      };
    }
    
    // Synchronisation de chaque réservation
    let syncedCount = 0;
    
    for (const reservation of reservations) {
      try {
        const eventId = await createCalendarEvent(reservation, accessToken);
        
        if (eventId) {
          // Mise à jour de la réservation avec l'ID de l'événement Google
          await supabase
            .from("reservations")
            .update({ google_event_id: eventId })
            .eq("id", reservation.id);
            
          syncedCount++;
        }
      } catch (error) {
        await logSyncActivity(`Erreur lors de la synchronisation de la réservation ${reservation.id}`, "error", error);
      }
    }
    
    // Mise à jour du timestamp de dernière synchronisation
    await supabase
      .from("admin_settings")
      .update({
        last_sync_timestamp: new Date().toISOString(),
        last_sync_status: "success",
        sync_error: null
      })
      .eq("id", 1);
    
    await logSyncActivity(`Synchronisation automatique terminée: ${syncedCount} réservation(s) synchronisée(s)`, "success");
    
    return { 
      success: true, 
      syncedCount, 
      message: `${syncedCount} réservation(s) synchronisée(s) avec succès` 
    };
  } catch (error) {
    await logSyncActivity("Erreur lors de la synchronisation automatique", "error", error);
    
    // Enregistrer l'erreur
    try {
      await supabase
        .from("admin_settings")
        .update({
          last_sync_status: "error",
          sync_error: `${error}`
        })
        .eq("id", 1);
    } catch (dbError) {
      console.error("Erreur lors de l'enregistrement de l'erreur:", dbError);
    }
    
    return { 
      success: false, 
      syncedCount: 0, 
      message: `Erreur lors de la synchronisation: ${error}` 
    };
  }
}

// Handler pour les requêtes HTTP
Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Protection par token ou clé API pour les appels manuels
  const url = new URL(req.url);
  const apiKey = url.searchParams.get("apiKey") || req.headers.get("x-api-key");
  
  // Si la requête provient du cron job interne, pas besoin de vérifier l'API key
  const isCronJob = req.headers.get("x-supabase-cron") === "true";
  
  if (!isCronJob && apiKey !== Deno.env.get("AUTO_SYNC_API_KEY")) {
    return new Response(JSON.stringify({ error: "API key invalide" }), { 
      status: 401, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
  
  try {
    // Ajout d'un log pour tracer les exécutions
    const executionStartTime = new Date().toISOString();
    await logSyncActivity(`Exécution démarrée à ${executionStartTime}`, "info", {
      isCronJob,
      requestHeaders: Object.fromEntries(req.headers.entries()), // Log des headers pour le débogage
    });
    
    const result = await autoSync();
    
    // Ajout d'un log de fin d'exécution
    await logSyncActivity(`Exécution terminée avec statut: ${result.success ? "Succès" : "Échec"}`, 
      result.success ? "success" : "error", {
        syncedCount: result.syncedCount,
        message: result.message,
        executionTime: `${(new Date().getTime() - new Date(executionStartTime).getTime()) / 1000}s`
      }
    );
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    await logSyncActivity("Erreur non gérée", "error", error);
    
    return new Response(JSON.stringify({ error: `Erreur interne: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
