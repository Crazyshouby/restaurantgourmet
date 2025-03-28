
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Configuration et en-têtes CORS
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Client Supabase avec role de service pour accès complet
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Réponses standards
function createJsonResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    }
  );
}

function createErrorResponse(message: string, status = 500) {
  return createJsonResponse({ error: message, success: false }, status);
}

// Récupère les paramètres d'administration
async function getAdminSettings() {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (error) {
    console.error('Erreur lors de la récupération des paramètres admin:', error);
    throw new Error('Impossible de récupérer les paramètres administrateur');
  }
  
  return data;
}

// Récupère un nouveau token d'accès en utilisant le refresh token
async function refreshAccessToken(refreshToken: string) {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token manquant');
    }
    
    console.log('Tentative de rafraîchissement du token avec le refresh token...');
    
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Réponse de rafraîchissement non OK:', tokenResponse.status, errorText);
      throw new Error(`Erreur HTTP: ${tokenResponse.status} ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    // Si nous avons une erreur liée au token invalide
    if (tokenData.error) {
      console.error('Erreur de rafraîchissement du token:', tokenData.error, tokenData.error_description);
      
      // Mettre à jour le statut dans les paramètres admin
      const { error: updateError } = await supabase
        .from('admin_settings')
        .update({
          google_connected: false, // Déconnecter automatiquement
          last_sync_status: 'error',
          sync_error: tokenData.error === 'invalid_grant' 
            ? 'Token Google expiré. Reconnexion requise.' 
            : `Erreur Google: ${tokenData.error} - ${tokenData.error_description}`
        })
        .eq('id', 1);
      
      if (updateError) {
        console.error('Erreur lors de la mise à jour du statut de connexion Google:', updateError);
      }
      
      throw new Error(`Échec du rafraîchissement du token: ${JSON.stringify(tokenData)}`);
    }
    
    if (!tokenData.access_token) {
      throw new Error(`Échec du rafraîchissement du token: Aucun access_token dans la réponse`);
    }
    
    console.log('Token rafraîchi avec succès');
    return tokenData.access_token;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    throw error;
  }
}

// Récupère les réservations non synchronisées
async function getUnsyncedReservations(lastSyncTimestamp: string | null) {
  const query = supabase
    .from('reservations')
    .select('*')
    .is('google_event_id', null)
    .eq('imported_from_google', false);
  
  if (lastSyncTimestamp) {
    // Si un timestamp de dernière synchronisation existe, ne récupérer que les réservations plus récentes
    query.gt('created_at', lastSyncTimestamp);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erreur lors de la récupération des réservations non synchronisées:', error);
    throw error;
  }
  
  // Convertir les dates en objets Date
  return data.map((r: any) => ({
    ...r,
    date: new Date(r.date),
    id: r.id
  }));
}

// Crée un événement dans Google Calendar
async function createCalendarEvent(reservation: any, accessToken: string) {
  try {
    // Formatage de la date et de l'heure
    const dateString = reservation.date instanceof Date 
      ? reservation.date.toISOString().split('T')[0] 
      : reservation.date;
    
    // Calcul de l'heure de fin (2 heures après l'heure de début)
    const [hours, minutes] = reservation.time.split(':');
    const endHour = parseInt(hours) + 2;
    
    // Création de l'événement
    const eventData = {
      summary: `Réservation: ${reservation.name}`,
      description: `Réservation pour ${reservation.guests} personne(s)\nTél: ${reservation.phone}\nEmail: ${reservation.email}\nNotes: ${reservation.notes || "Aucune"}`,
      start: {
        dateTime: `${dateString}T${reservation.time}:00-04:00`,
        timeZone: 'America/New_York', // GMT-4 (fuseau horaire de l'Est canadien)
      },
      end: {
        dateTime: `${dateString}T${endHour}:${minutes}:00-04:00`,
        timeZone: 'America/New_York', // GMT-4 (fuseau horaire de l'Est canadien)
      },
    };
    
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(eventData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur API Google Calendar (${response.status}): ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return { success: true, eventId: data.id };
  } catch (error) {
    console.error('Exception lors de la création de l\'événement Google Calendar:', error);
    return { success: false };
  }
}

// Met à jour l'ID de l'événement Google Calendar dans la base de données
async function updateGoogleEventId(reservationId: string, googleEventId: string) {
  const { error } = await supabase
    .from('reservations')
    .update({ google_event_id: googleEventId })
    .eq('id', reservationId);

  if (error) {
    console.error('Erreur lors de la mise à jour de l\'ID d\'événement Google Calendar:', error);
    throw error;
  }

  return true;
}

// Enregistre un log de synchronisation
async function logSyncResult(status: string, syncedCount: number, errorMessage?: string) {
  const { error } = await supabase
    .from('sync_logs')
    .insert({
      status: status,
      reservations_synced: syncedCount,
      error_message: errorMessage
    });
  
  if (error) {
    console.error('Erreur lors de l\'enregistrement du log de synchronisation:', error);
  }

  // Mise à jour du timestamp de dernière synchronisation dans admin_settings
  if (status === 'success') {
    const { error: updateError } = await supabase
      .from('admin_settings')
      .update({ 
        last_sync_timestamp: new Date().toISOString(),
        last_sync_status: 'success',
        sync_error: null
      })
      .eq('id', 1);
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour du timestamp de dernière synchronisation:', updateError);
    }
  } else if (status === 'error') {
    const { error: updateError } = await supabase
      .from('admin_settings')
      .update({ 
        last_sync_status: 'error',
        sync_error: errorMessage
      })
      .eq('id', 1);
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour du statut d\'erreur:', updateError);
    }
  }
}

// Fonction principale de synchronisation
async function syncReservations() {
  try {
    console.log('Démarrage de la synchronisation automatique...');
    
    // Récupérer les paramètres administrateur
    const adminSettings = await getAdminSettings();
    
    // Vérifier si la synchronisation automatique est activée
    if (!adminSettings.auto_sync_enabled) {
      console.log('Synchronisation automatique désactivée dans les paramètres');
      return { success: true, message: 'Synchronisation automatique désactivée' };
    }
    
    // Vérifier si Google est connecté et si nous avons un refresh token
    if (!adminSettings.google_connected || !adminSettings.google_refresh_token) {
      console.log('Google non connecté ou refresh token manquant');
      await logSyncResult('error', 0, 'Aucun compte Google connecté');
      return { success: false, error: 'Aucun compte Google connecté' };
    }
    
    try {
      // Obtenir un nouveau token d'accès
      console.log('Tentative de rafraîchissement du token...');
      const accessToken = await refreshAccessToken(adminSettings.google_refresh_token);
      
      // Récupérer les réservations non synchronisées
      const reservations = await getUnsyncedReservations(adminSettings.last_sync_timestamp);
      
      console.log(`${reservations.length} réservations à synchroniser`);
      
      if (reservations.length === 0) {
        await logSyncResult('success', 0);
        return { success: true, message: 'Aucune nouvelle réservation à synchroniser' };
      }
      
      let syncedCount = 0;
      
      // Synchroniser chaque réservation
      for (const reservation of reservations) {
        try {
          console.log(`Synchronisation de la réservation ${reservation.id} pour ${reservation.name}`);
          
          const { success, eventId } = await createCalendarEvent(reservation, accessToken);
          
          if (success && eventId) {
            await updateGoogleEventId(reservation.id, eventId);
            syncedCount++;
          }
        } catch (error) {
          console.error(`Erreur lors de la synchronisation de la réservation ${reservation.id}:`, error);
        }
      }
      
      // Enregistrer le résultat de la synchronisation
      await logSyncResult('success', syncedCount);
      
      return { success: true, syncedCount };
    } catch (error) {
      // Si l'erreur contient "invalid_grant", cela signifie que le token a expiré
      if (error.message && (
          error.message.includes('invalid_grant') || 
          error.message.includes('Refresh token expired') ||
          error.message.includes('Token has been expired or revoked')
      )) {
        console.error('Token Google expiré ou révoqué:', error);
        await logSyncResult('error', 0, 'Token Google expiré. Reconnexion requise.');
        return { 
          success: false, 
          error: 'La connexion à Google a expiré. Veuillez vous reconnecter à votre compte Google.' 
        };
      }
      
      // Autres erreurs
      console.error('Erreur lors de la synchronisation automatique:', error);
      
      // Enregistrer l'erreur dans les logs
      await logSyncResult('error', 0, error.message);
      
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('Erreur non gérée lors de la synchronisation automatique:', error);
    
    // Enregistrer l'erreur dans les logs
    await logSyncResult('error', 0, error.message);
    
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  // Gestion des requêtes CORS OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Le endpoint n'accepte que les requêtes POST et GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    return createErrorResponse('Méthode non autorisée', 405);
  }

  try {
    // Lancer la synchronisation
    const result = await syncReservations();
    
    return createJsonResponse(result);
  } catch (error) {
    console.error('Erreur non gérée:', error);
    return createErrorResponse(error.message);
  }
});
