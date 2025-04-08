
import { Reservation } from '@/types';
import { ReservationFetchService } from './fetch-service';
import { ReservationDeletionService } from './deletion-service';
import { ReservationUpdateService } from './update-service';
import { ReservationDbService } from './db-service';

/**
 * Service de base pour les opérations CRUD sur les réservations
 */
export class ReservationBaseService {
  // Opérations de récupération
  static getReservations = ReservationFetchService.getReservations;
  
  // Opérations de suppression
  static deleteReservation = ReservationDeletionService.deleteReservation;
  
  // Opérations de mise à jour
  static updateReservation = ReservationUpdateService.updateReservation;
  static updateGoogleEventId = ReservationUpdateService.updateGoogleEventId;
  
  // Opérations de base de données
  static createReservationInDatabase = ReservationDbService.createReservationInDatabase;
}
