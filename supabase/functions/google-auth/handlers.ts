
import { 
  supabase, 
  CLIENT_ID, 
  CLIENT_SECRET, 
  REDIRECT_URI, 
  SCOPES,
  corsHeaders
} from "./config.ts";
import { 
  createJsonResponse, 
  createErrorResponse, 
  createRedirectResponse,
  formatCalendarEvent 
} from "./utils.ts";

// Initialisation de l'authentification Google
export async function handleInit(url: URL) {
  const state = crypto.randomUUID();
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  
  // Utilisons l'URL d'origine pour déterminer le bon URI de redirection
  const origin = url.origin;
  const effectiveRedirectUri = REDIRECT_URI || `${origin}/google-auth/callback`;
  
  console.log("Initialisation OAuth avec redirection vers:", effectiveRedirectUri);
  
  authUrl.searchParams.append("client_id", CLIENT_ID);
  authUrl.searchParams.append("redirect_uri", effectiveRedirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", SCOPES.join(" "));
  authUrl.searchParams.append("access_type", "offline");
  authUrl.searchParams.append("prompt", "consent");
  authUrl.searchParams.append("state", state);
  
  return createJsonResponse({ url: authUrl.toString() });
}

// Gestion du callback OAuth
export async function handleCallback(url: URL) {
  try {
    const params = url.searchParams;
    const code = params.get("code");
    
    if (!code) {
      return createErrorResponse("Code d'autorisation manquant", 400);
    }
    
    console.log("Code d'autorisation reçu, échange contre des tokens...");
    
    // Utilisons l'URL d'origine pour déterminer le bon URI de redirection
    const origin = url.origin;
    const effectiveRedirectUri = REDIRECT_URI || `${origin}/google-auth/callback`;
    
    console.log("Utilisation de l'URI de redirection:", effectiveRedirectUri);
    
    // Échange du code contre des tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: effectiveRedirectUri,
        grant_type: "authorization_code",
      }),
    });
    
    const tokenData = await tokenRes.json();
    
    if (!tokenData.access_token || !tokenData.refresh_token) {
      console.error("Tokens invalides reçus:", tokenData);
      throw new Error("Tokens invalides reçus de Google");
    }
    
    console.log("Tokens reçus avec succès, récupération des informations du profil...");
    
    // Récupération des informations du profil utilisateur
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const profileData = await profileRes.json();
    console.log("Profil récupéré:", profileData.email);
    
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
      console.error("Erreur de mise à jour Supabase:", error);
      throw new Error("Erreur lors de la mise à jour des paramètres admin: " + error.message);
    }
    
    console.log("Paramètres admin mis à jour avec succès");
    
    // Redirection vers la page d'administration avec un message de succès
    // Nous utilisons une URL absolue pour la redirection
    const appHostname = Deno.env.get("APP_HOSTNAME") || url.hostname.replace('jmgzpeubdaemrxvsmwss', 'app');
    const appProtocol = appHostname.includes('localhost') ? 'http:' : 'https:';
    const redirectUrl = new URL("/admin?auth=success", `${appProtocol}//${appHostname}`);
    
    console.log("Redirection vers:", redirectUrl.toString());
    
    return createRedirectResponse(redirectUrl.toString());
  } catch (error) {
    console.error("Erreur dans le callback OAuth:", error);
    return createErrorResponse(error.message);
  }
}

// Fonction pour rafraîchir un token d'accès
export async function handleRefreshToken() {
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
    
    return createJsonResponse({ access_token: tokenData.access_token });
  } catch (error) {
    return createErrorResponse(error.message);
  }
}

// Fonction pour créer un événement dans Google Calendar
export async function handleCreateEvent(req: Request, url: URL) {
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
    
    // Création de l'événement
    const eventData = formatCalendarEvent(reservation);
    
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
    
    return createJsonResponse({ success: true, eventId: calendarData.id });
  } catch (error) {
    return createJsonResponse({ error: error.message, success: false }, 500);
  }
}

// Fonction pour obtenir tous les événements
export async function handleGetEvents(url: URL) {
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
    
    return createJsonResponse(calendarData);
  } catch (error) {
    return createErrorResponse(error.message);
  }
}
