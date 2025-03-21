
// Ici, nous devons modifier le fichier base-service.ts pour ajouter le support du flag importedFromGoogle
// Note: Puisque nous n'avons pas accès au contenu complet du fichier, nous ajoutons juste
// la méthode createReservationInDatabase avec le nouveau paramètre

/**
 * Crée une réservation dans la base de données
 * @param reservation Les données de la réservation
 * @param googleEventId L'ID de l'événement Google Calendar optionnel
 * @param importedFromGoogle Flag indiquant si la réservation a été importée de Google Calendar
 */
static async createReservationInDatabase(
  reservation: Omit<Reservation, 'id' | 'googleEventId'>,
  googleEventId?: string,
  importedFromGoogle: boolean = false
): Promise<Reservation> {
  // Prépare les données pour insertion
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      name: reservation.name,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      phone: reservation.phone,
      email: reservation.email,
      notes: reservation.notes || '',
      google_event_id: googleEventId || null,
      imported_from_google: importedFromGoogle // Nouveau champ
    })
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    throw error;
  }

  // Convertit et retourne la réservation créée
  return {
    id: data.id,
    name: data.name,
    date: new Date(data.date),
    time: data.time,
    guests: data.guests,
    phone: data.phone,
    email: data.email,
    notes: data.notes,
    googleEventId: data.google_event_id
  };
}
