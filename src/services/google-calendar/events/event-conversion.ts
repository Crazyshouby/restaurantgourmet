
import { Reservation } from '@/types';

/**
 * Extracts the guest count from a Google Calendar event description
 */
function extractGuestCount(description: string): number {
  const lines = description.split('\n');
  for (const line of lines) {
    if (line.startsWith('Réservation pour')) {
      const guestsMatch = line.match(/Réservation pour (\d+) personne/);
      if (guestsMatch && guestsMatch[1]) {
        return parseInt(guestsMatch[1], 10);
      }
    }
  }
  return 1; // Default guest count
}

/**
 * Extracts contact information from a Google Calendar event description
 */
function extractContactInfo(description: string): { phone: string; email: string; notes: string } {
  let phone = '';
  let email = '';
  let notes = '';
  
  const lines = description.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('Tél:')) {
      phone = line.replace('Tél:', '').trim();
    } else if (line.startsWith('Email:')) {
      email = line.replace('Email:', '').trim();
    } else if (line.startsWith('Notes:')) {
      notes = line.replace('Notes:', '').trim();
    }
  }
  
  return {
    phone: phone || 'sans information',
    email: email || 'sans information',
    notes: notes || ''
  };
}

/**
 * Checks if an event is a valid reservation event
 */
function isValidReservationEvent(event: any): boolean {
  return event.summary && 
         event.summary.startsWith('Réservation:') && 
         event.start && 
         event.start.dateTime;
}

/**
 * Formats date and time from a Google Calendar event
 */
function formatDateTime(startDateTime: string): { date: Date; time: string } {
  const parsedDateTime = new Date(startDateTime);
  const date = new Date(parsedDateTime.toISOString().split('T')[0]);
  const time = parsedDateTime.toTimeString().substring(0, 5);
  
  return { date, time };
}

export class EventConversionService {
  // Convertit les événements Google Calendar en réservations
  static async convertEventsToReservations(events: any[]): Promise<Omit<Reservation, 'id' | 'googleEventId'>[]> {
    try {
      const reservations: Omit<Reservation, 'id' | 'googleEventId'>[] = [];
      
      for (const event of events) {
        // Skip non-reservation events
        if (!isValidReservationEvent(event)) {
          continue;
        }
        
        // Extract the name from the summary
        const name = event.summary.replace('Réservation:', '').trim();
        
        // Format date and time
        const { date, time } = formatDateTime(event.start.dateTime);
        
        // Set default values
        let guests = 1;
        let phone = 'sans information';
        let email = 'sans information';
        let notes = '';
        
        // Extract additional details from description
        if (event.description) {
          guests = extractGuestCount(event.description);
          const contactInfo = extractContactInfo(event.description);
          phone = contactInfo.phone;
          email = contactInfo.email;
          notes = contactInfo.notes;
        }
        
        // Create the reservation object
        reservations.push({
          name,
          date,
          time,
          guests,
          phone,
          email,
          notes
        });
      }
      
      return reservations;
    } catch (error) {
      console.error('Exception lors de la conversion des événements en réservations:', error);
      return [];
    }
  }
}
