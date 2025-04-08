
import { EventCreationService } from './event-creation';
import { EventFetchService } from './event-fetch';
import { EventDeletionService } from './event-deletion';
import { EventUpdateService } from './event-update';
import { EventConversionService } from './event-conversion';

// Exporting all event services
export class GoogleCalendarEventsService {
  // Create events
  static createEvent = EventCreationService.createEvent;
  
  // Fetch events
  static getEvents = EventFetchService.getEvents;
  
  // Delete events
  static deleteEvent = EventDeletionService.deleteEvent;
  
  // Update events
  static updateEvent = EventUpdateService.updateEvent;
  
  // Convert events
  static convertEventsToReservations = EventConversionService.convertEventsToReservations;
}
