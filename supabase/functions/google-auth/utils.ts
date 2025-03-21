
import { corsHeaders } from "./config.ts";

// Création d'une réponse JSON standard
export function createJsonResponse(data: any, status = 200) {
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

// Création d'une réponse d'erreur standardisée
export function createErrorResponse(message: string, status = 500) {
  return createJsonResponse({ error: message }, status);
}

// Création d'une redirection
export function createRedirectResponse(location: string, status = 302) {
  return new Response(null, {
    status,
    headers: {
      Location: location,
      ...corsHeaders,
    },
  });
}

// Formatage d'un événement pour Google Calendar
export function formatCalendarEvent(reservation: any) {
  // Formatage de la date et de l'heure pour le début
  const dateString = reservation.date instanceof Date 
    ? reservation.date.toISOString().split('T')[0] 
    : reservation.date;
  
  // Calcul de l'heure de fin (par défaut 2 heures après)
  const [hours, minutes] = reservation.time.split(':');
  const endHour = parseInt(hours) + 2;
  const endTime = `${endHour}:${minutes}:00`;
  
  // Création de l'objet événement
  return {
    summary: `Réservation: ${reservation.name}`,
    description: `Réservation pour ${reservation.guests} personne(s)
Tél: ${reservation.phone}
Email: ${reservation.email}
Notes: ${reservation.notes || "Aucune"}`,
    start: {
      dateTime: `${dateString}T${reservation.time}:00-04:00`,
      timeZone: 'America/New_York', // GMT-4 (fuseau horaire de l'Est canadien)
    },
    end: {
      dateTime: `${dateString}T${endTime}-04:00`,
      timeZone: 'America/New_York', // GMT-4 (fuseau horaire de l'Est canadien)
    },
  };
}
