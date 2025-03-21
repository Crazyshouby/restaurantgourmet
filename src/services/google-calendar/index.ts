
import { GoogleCalendarAuthService } from './auth-service';
import { GoogleCalendarEventsService } from './events-service';
import { getAdminSettings } from './utils';
import { GoogleCalendarSettings, GoogleCalendarEvent, GoogleCalendarAuthResponse, GoogleCalendarEventResponse } from './types';

// Classe principale qui exporte toutes les fonctionnalités
export class GoogleCalendarService {
  // Méthodes d'authentification
  static isConnected = GoogleCalendarAuthService.isConnected;
  static connect = GoogleCalendarAuthService.connect;
  static disconnect = GoogleCalendarAuthService.disconnect;
  
  // Méthodes d'événements
  static createEvent = GoogleCalendarEventsService.createEvent;
  static getEvents = GoogleCalendarEventsService.getEvents;
  static convertEventsToReservations = GoogleCalendarEventsService.convertEventsToReservations;
  static deleteEvent = GoogleCalendarEventsService.deleteEvent;
  
  // Méthodes utilitaires
  static getAdminSettings = getAdminSettings;
}

// Export des types pour une utilisation externe
export type {
  GoogleCalendarSettings,
  GoogleCalendarEvent,
  GoogleCalendarAuthResponse,
  GoogleCalendarEventResponse
};
