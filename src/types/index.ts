
export interface Reservation {
  id: string;
  date: Date;
  time: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  notes?: string;
  googleEventId?: string;
  importedFromGoogle?: boolean;
}

export interface AdminSettings {
  googleConnected: boolean;
  googleEmail?: string;
  googleRefreshToken?: string;
  timeSlots?: string[];
  maxGuestsPerDay?: number;
  
  lastSyncTimestamp?: string;
  lastSyncStatus?: string;
  syncError?: string;
}

export interface DailyAvailability {
  date: string;
  remainingCapacity: number;
  totalCapacity: number;
}
