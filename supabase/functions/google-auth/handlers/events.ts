
import { corsHeaders } from "../config.ts";
import { createJsonResponse, createErrorResponse, formatCalendarEvent } from "../utils.ts";

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
