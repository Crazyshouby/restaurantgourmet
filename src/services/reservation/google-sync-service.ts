
import { GoogleCalendarService } from '../google-calendar';
import { Reservation } from '@/types';
import { ReservationUpdateService } from './update-service';
import { ReservationFetchService } from './fetch-service';
import { SyncResponse } from '../google-calendar/types';

/**
 * Service pour la synchronisation des réservations avec Google Calendar
 */
export class ReservationGoogleSyncService {
  /**
   * Synchronise les réservations existantes avec Google Calendar
   */
  static async syncWithGoogleCalendar(): Promise<SyncResponse> {
    try {
      const isConnected = await GoogleCalendarService.isConnected();
      
      if (!isConnected) {
        return { success: false, syncedCount: 0, error: "Google Calendar non connecté" };
      }
      
      // Récupère toutes les réservations non synchronisées
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .is('google_event_id', null)
        .eq('imported_from_google', false); // Ne synchroniser que les réservations qui n'ont pas été importées de Google
      
      if (error) {
        console.error('Erreur lors de la récupération des réservations non synchronisées:', error);
        return { success: false, syncedCount: 0, error: error.message };
      }
      
      // Convertit les dates en objets Date
      const reservations = data.map((r: any) => ({
        ...r,
        date: new Date(r.date),
        googleEventId: r.google_event_id
      }));
      
      console.log(`${reservations.length} réservations à synchroniser avec Google Calendar`);
      
      let syncedCount = 0;
      
      // Synchronise chaque réservation
      for (const reservation of reservations) {
        try {
          const { success, eventId } = await GoogleCalendarService.createEvent(reservation);
          
          if (success && eventId) {
            // Met à jour la réservation avec l'ID de l'événement Google Calendar
            const updated = await ReservationUpdateService.updateGoogleEventId(reservation.id, eventId);
            
            if (updated) {
              syncedCount++;
            }
          }
        } catch (error) {
          console.error(`Erreur lors de la synchronisation de la réservation ${reservation.id}:`, error);
        }
      }
      
      return { success: true, syncedCount };
    } catch (error) {
      console.error('Erreur lors de la synchronisation avec Google Calendar:', error);
      return { success: false, syncedCount: 0, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  /**
   * Importe les événements de Google Calendar
   */
  static async importFromGoogleCalendar(): Promise<SyncResponse> {
    try {
      const isConnected = await GoogleCalendarService.isConnected();
      
      if (!isConnected) {
        return { success: false, importedCount: 0, error: "Google Calendar non connecté" };
      }
      
      // Récupère les événements Google Calendar
      const events = await GoogleCalendarService.getEvents();
      
      if (!events || events.length === 0) {
        return { success: true, importedCount: 0 };
      }
      
      // Convertit les événements en réservations
      const calendarReservations = await GoogleCalendarService.convertEventsToReservations(events);
      
      if (calendarReservations.length === 0) {
        return { success: true, importedCount: 0 };
      }
      
      console.log(`${calendarReservations.length} événements importés depuis Google Calendar`);
      
      // Récupère toutes les réservations existantes
      const existingReservations = await ReservationFetchService.getReservations();
      
      let importedCount = 0;
      
      // Pour chaque événement
      for (const reservation of calendarReservations) {
        try {
          // Vérification plus stricte pour éviter les doublons
          // Vérifie si une réservation similaire existe déjà
          const existingSimilar = existingReservations.some(r => {
            // Comparaison de la date formatée, l'heure et le nom
            return r.date.toISOString().split('T')[0] === reservation.date.toISOString().split('T')[0] && 
                   r.time === reservation.time && 
                   r.name === reservation.name;
          });
          
          // Si on a déjà une réservation très similaire, on saute
          if (existingSimilar) {
            console.log(`Réservation similaire ignorée pour ${reservation.name} le ${reservation.date.toISOString().split('T')[0]} à ${reservation.time}`);
            continue;
          }
          
          // Vérifie aussi si nous avons déjà importé cet événement avec une date différente
          // Cela évite les doublons sur des jours différents mais avec les mêmes informations
          const similarOnAnyDate = existingReservations.some(r => 
            r.name === reservation.name && 
            r.time === reservation.time &&
            Math.abs((r.date.getTime() - reservation.date.getTime()) / (1000 * 60 * 60 * 24)) <= 1 // Vérification de 1 jour d'écart
          );
          
          // Si nous avons une réservation similaire à un jour près, on l'ignore
          if (similarOnAnyDate) {
            console.log(`Réservation similaire (date proche) ignorée pour ${reservation.name} le ${reservation.date.toISOString().split('T')[0]} à ${reservation.time}`);
            continue;
          }
          
          // Crée la réservation avec le flag indiquant qu'elle provient de Google Calendar
          const importedReservation = {
            ...reservation,
            importedFromGoogle: true, // Marquer comme importée de Google Calendar
            // Stocker l'ID de l'événement Google pour permettre la suppression plus tard
            googleEventId: events.find(e => 
              e.summary === `Réservation: ${reservation.name}` && 
              new Date(e.start.dateTime).toTimeString().substring(0, 5) === reservation.time
            )?.id
          };
          
          // Crée la réservation
          await ReservationCreationService.createReservation(importedReservation);
          importedCount++;
        } catch (error) {
          console.error('Erreur lors de l\'importation d\'un événement:', error);
        }
      }
      
      return { success: true, importedCount };
    } catch (error) {
      console.error('Erreur lors de l\'importation depuis Google Calendar:', error);
      return { success: false, importedCount: 0, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }
}

// Importation supabase pour les requêtes spécifiques
import { supabase } from '@/integrations/supabase/client';
// Import pour créer des réservations après importation
import { ReservationCreationService } from './creation-service';
