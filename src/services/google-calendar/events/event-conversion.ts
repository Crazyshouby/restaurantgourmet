
import { Reservation } from '@/types';

export class EventConversionService {
  // Convertit les événements Google Calendar en réservations
  static async convertEventsToReservations(events: any[]): Promise<Omit<Reservation, 'id' | 'googleEventId'>[]> {
    try {
      const reservations: Omit<Reservation, 'id' | 'googleEventId'>[] = [];
      
      for (const event of events) {
        // On ne traite que les événements qui commencent par "Réservation:"
        if (!event.summary || !event.summary.startsWith('Réservation:')) {
          continue;
        }
        
        // Extraction des informations de l'événement
        const name = event.summary.replace('Réservation:', '').trim();
        let guests = 1;
        let phone = '';
        let email = '';
        let notes = '';
        
        // Analyse de la description pour extraire les détails
        if (event.description) {
          const descLines = event.description.split('\n');
          
          for (const line of descLines) {
            if (line.startsWith('Réservation pour')) {
              const guestsMatch = line.match(/Réservation pour (\d+) personne/);
              if (guestsMatch && guestsMatch[1]) {
                guests = parseInt(guestsMatch[1], 10);
              }
            } else if (line.startsWith('Tél:')) {
              phone = line.replace('Tél:', '').trim();
            } else if (line.startsWith('Email:')) {
              email = line.replace('Email:', '').trim();
            } else if (line.startsWith('Notes:')) {
              notes = line.replace('Notes:', '').trim();
            }
          }
        }
        
        // S'assurer que nous avons les informations minimales requises
        if (!name || !event.start || !event.start.dateTime) {
          continue;
        }
        
        // Formatage de la date et de l'heure
        const startDateTime = new Date(event.start.dateTime);
        const date = startDateTime.toISOString().split('T')[0];
        const time = startDateTime.toTimeString().substring(0, 5);
        
        // Création de la réservation
        reservations.push({
          name,
          date: new Date(date),
          time,
          guests,
          phone: phone || 'sans information', // Valeur par défaut améliorée
          email: email || 'sans information', // Valeur par défaut améliorée
          notes: notes || ''
        });
      }
      
      return reservations;
    } catch (error) {
      console.error('Exception lors de la conversion des événements en réservations:', error);
      return [];
    }
  }
}
