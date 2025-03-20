
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";
const REDIRECT_URI = Deno.env.get("GOOGLE_REDIRECT_URI") || "";

// Scopes nécessaires pour Google Calendar
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  // Initialisation de l'authentification Google
  if (path === "init") {
    const state = crypto.randomUUID();
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    
    authUrl.searchParams.append("client_id", CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", SCOPES.join(" "));
    authUrl.searchParams.append("access_type", "offline");
    authUrl.searchParams.append("prompt", "consent");
    authUrl.searchParams.append("state", state);
    
    return new Response(JSON.stringify({ url: authUrl.toString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
  
  // Gestion du callback OAuth
  if (path === "callback") {
    try {
      const params = url.searchParams;
      const code = params.get("code");
      
      if (!code) {
        return new Response(
          JSON.stringify({ error: "Code d'autorisation manquant" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      // Échange du code contre des tokens
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        }),
      });
      
      const tokenData = await tokenRes.json();
      
      if (!tokenData.access_token || !tokenData.refresh_token) {
        throw new Error("Tokens invalides reçus de Google");
      }
      
      // Récupération des informations du profil utilisateur
      const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      
      const profileData = await profileRes.json();
      
      // Mise à jour des paramètres admin dans Supabase
      const { error } = await supabase
        .from("admin_settings")
        .update({
          google_connected: true,
          google_refresh_token: tokenData.refresh_token,
          google_email: profileData.email,
          updated_at: new Date(),
        })
        .eq("id", 1);
      
      if (error) {
        throw new Error("Erreur lors de la mise à jour des paramètres admin: " + error.message);
      }
      
      // Redirection vers la page d'administration avec un message de succès
      // Utilisation de l'URL d'origine pour la redirection (avec le bon protocole et domaine)
      const redirectUrl = new URL("/admin", url.origin);
      redirectUrl.searchParams.append("auth", "success");
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Location": redirectUrl.toString(),
        },
      });
    } catch (error) {
      console.error("Erreur dans le callback OAuth:", error);
      
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  }
  
  // Fonction pour rafraîchir un token d'accès
  if (path === "refresh-token") {
    try {
      // Récupération du refresh token depuis Supabase
      const { data, error } = await supabase
        .from("admin_settings")
        .select("google_refresh_token")
        .eq("id", 1)
        .single();
      
      if (error || !data.google_refresh_token) {
        throw new Error("Refresh token non trouvé");
      }
      
      // Demande d'un nouveau token d'accès
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: data.google_refresh_token,
          grant_type: "refresh_token",
        }),
      });
      
      const tokenData = await tokenRes.json();
      
      if (!tokenData.access_token) {
        throw new Error("Impossible de rafraîchir le token");
      }
      
      return new Response(
        JSON.stringify({ access_token: tokenData.access_token }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  }
  
  // Fonction pour créer un événement dans Google Calendar
  if (path === "create-event") {
    try {
      const requestData = await req.json();
      const { reservation } = requestData;
      
      if (!reservation) {
        throw new Error("Données de réservation manquantes");
      }
      
      // Récupération d'un token d'accès valide
      const tokenResponse = await fetch(`${url.origin}/google-auth/refresh-token`, {
        method: "GET",
        headers: corsHeaders,
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenData.access_token) {
        throw new Error("Impossible d'obtenir un token d'accès valide");
      }
      
      // Formatage de la date et de l'heure
      const dateString = reservation.date instanceof Date 
        ? reservation.date.toISOString().split("T")[0] 
        : reservation.date;
      
      // Création de l'événement
      const eventData = {
        summary: `Réservation: ${reservation.name}`,
        description: `Réservation pour ${reservation.guests} personne(s)\nTél: ${reservation.phone}\nEmail: ${reservation.email}\nNotes: ${reservation.notes || "Aucune"}`,
        start: {
          dateTime: `${dateString}T${reservation.time}:00`,
          timeZone: "Europe/Paris",
        },
        end: {
          dateTime: `${dateString}T${parseInt(reservation.time.split(":")[0]) + 2}:${reservation.time.split(":")[1]}:00`,
          timeZone: "Europe/Paris",
        },
      };
      
      // Envoi de la requête à l'API Google Calendar
      const calendarRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      
      const calendarData = await calendarRes.json();
      
      if (!calendarData.id) {
        throw new Error("Erreur lors de la création de l'événement");
      }
      
      return new Response(
        JSON.stringify({ success: true, eventId: calendarData.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message, success: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  }
  
  // Fonction pour obtenir tous les événements
  if (path === "events") {
    try {
      // Récupération d'un token d'accès valide
      const tokenResponse = await fetch(`${url.origin}/google-auth/refresh-token`, {
        method: "GET",
        headers: corsHeaders,
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenData.access_token) {
        throw new Error("Impossible d'obtenir un token d'accès valide");
      }
      
      // Requête à l'API Google Calendar
      const calendarRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      
      const calendarData = await calendarRes.json();
      
      return new Response(
        JSON.stringify(calendarData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  }
  
  // Route par défaut
  return new Response(
    JSON.stringify({ error: "Route non trouvée" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
  );
});
