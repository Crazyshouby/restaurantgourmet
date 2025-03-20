
import { AdminSettings } from '@/types';

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export interface GoogleCalendarAuthResponse {
  success: boolean;
  email?: string;
  token?: string;
}

export interface GoogleCalendarEventResponse {
  success: boolean;
  eventId?: string;
}

export interface GoogleCalendarSettings extends AdminSettings {
  // Types spécifiques pour les paramètres Google Calendar
}
