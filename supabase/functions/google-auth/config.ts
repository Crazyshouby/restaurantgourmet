
// Importation des dépendances
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Configuration des variables d'environnement
export const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
export const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
export const CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
export const CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";

// Utilisons une redirection dynamique au lieu d'une URL fixe vers localhost
// L'URL de redirection sera configurée en fonction de l'URL d'origine de la requête
export const REDIRECT_URI = Deno.env.get("GOOGLE_REDIRECT_URI") || "";

// Scopes nécessaires pour Google Calendar
export const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

// Client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// En-têtes CORS
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
