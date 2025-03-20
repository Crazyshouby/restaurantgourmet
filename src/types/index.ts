
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
}

export interface AdminSettings {
  googleConnected: boolean;
  googleRefreshToken?: string;
  googleEmail?: string;
}
