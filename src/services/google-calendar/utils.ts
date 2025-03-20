
import { supabase } from '@/integrations/supabase/client';
import { GoogleCalendarSettings } from './types';

// Récupère les paramètres d'administration
export async function getAdminSettings(): Promise<GoogleCalendarSettings> {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération des paramètres admin:', error);
      return { googleConnected: false };
    }
    
    return {
      googleConnected: data.google_connected,
      googleRefreshToken: data.google_refresh_token,
      googleEmail: data.google_email
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres admin:', error);
    return { googleConnected: false };
  }
}

// Formate une date et heure pour Google Calendar
export function formatDateTimeForCalendar(date: Date | string, time: string): string {
  const dateString = date instanceof Date 
    ? date.toISOString().split('T')[0] 
    : date;
  
  return `${dateString}T${time}:00`;
}

// Calcule l'heure de fin (2 heures après l'heure de début)
export function calculateEndTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const endHour = parseInt(hours) + 2;
  
  return `${endHour}:${minutes}:00`;
}
