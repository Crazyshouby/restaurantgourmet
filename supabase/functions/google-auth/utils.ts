
import { corsHeaders } from "./config.ts";

// Fonction pour créer une réponse JSON
export function createJsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

// Fonction pour créer une réponse d'erreur
export function createErrorResponse(error: string, status = 500) {
  return createJsonResponse({ error }, status);
}

// Fonction pour créer une réponse de redirection
export function createRedirectResponse(url: string) {
  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      "Location": url,
    },
  });
}

// Fonction pour formater un événement Google Calendar
export function formatCalendarEvent(reservation: any) {
  // Formatage de la date et de l'heure
  const dateString = reservation.date instanceof Date 
    ? reservation.date.toISOString().split("T")[0] 
    : reservation.date;
  
  // Création de l'événement
  return {
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
}
