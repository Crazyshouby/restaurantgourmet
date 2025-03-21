
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./config.ts";
import { createErrorResponse } from "./utils.ts";
import { 
  handleInit, 
  handleCallback, 
  handleRefreshToken, 
  handleCreateEvent, 
  handleGetEvents 
} from "./handlers/index.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  console.log(`Requête reçue: ${req.method} ${url.pathname} depuis ${url.origin}`);

  // Router pour les différentes fonctionalités
  try {
    switch (path) {
      case "init":
        return await handleInit(url);

      case "callback":
        return await handleCallback(url);

      case "refresh-token":
        return await handleRefreshToken();

      case "create-event":
        return await handleCreateEvent(req, url);

      case "events":
        return await handleGetEvents(url);

      default:
        return createErrorResponse("Route non trouvée", 404);
    }
  } catch (error) {
    console.error("Erreur non gérée:", error);
    return createErrorResponse("Erreur interne du serveur", 500);
  }
});
