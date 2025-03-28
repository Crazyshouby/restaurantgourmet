
/**
 * Service de réservation - Point d'entrée principal
 * 
 * Ce module centralise toutes les fonctionnalités liées aux réservations
 * et les expose via une API unifiée et bien documentée.
 * 
 * Les fonctionnalités sont organisées en services spécialisés:
 * - BaseService: opérations CRUD de base
 * - CreationService: logique spécifique à la création de réservations
 * - GoogleSyncService: synchronisation avec Google Calendar
 */

import { ReservationBaseService } from './base-service';
import { ReservationCreationService } from './creation-service';
import { ReservationGoogleSyncService } from './google-sync-service';
import { Reservation } from '@/types';

export class ReservationService {
  /**
   * Opérations de base sur les réservations
   */
  static getReservations = ReservationBaseService.getReservations;
  static deleteReservation = ReservationBaseService.deleteReservation;
  static updateReservation = ReservationBaseService.updateReservation;
  
  /**
   * Création de réservation avec validation et traitement spécifique
   */
  static createReservation = ReservationCreationService.createReservation;
  
  /**
   * Fonctionnalités de synchronisation avec Google Calendar
   */
  static syncWithGoogleCalendar = ReservationGoogleSyncService.syncWithGoogleCalendar;
  static importFromGoogleCalendar = ReservationGoogleSyncService.importFromGoogleCalendar;
}

/**
 * Exporte le type Reservation pour faciliter son utilisation
 */
export type { Reservation };
