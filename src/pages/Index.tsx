
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import ReservationCalendar from "@/components/ReservationCalendar";
import ReservationForm from "@/components/ReservationForm";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Layout from "@/components/home/Layout";
import { ReservationService } from "@/services/reservation";
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { isLoading, withLoading } = useLoadingState();

  const handleReservationSubmit = useCallback(async (formData: any) => {
    await withLoading(async () => {
      try {
        // Appel à Supabase via ReservationService
        await ReservationService.createReservation({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          notes: formData.notes
        });

        // Créer une date complète avec la date et l'heure sélectionnées
        const reservationDateTime = new Date(formData.date);
        const [hours, minutes] = formData.time.split(':');
        reservationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        toast.success("Réservation confirmée", {
          description: `Votre table est réservée pour le ${format(reservationDateTime, "d MMMM à HH:mm", {
            locale: fr
          })}`
        });

        // Réinitialiser le formulaire
        setSelectedDate(undefined);
      } catch (error) {
        console.error("Erreur lors de la réservation:", error);
        toast.error("Erreur lors de la réservation", {
          description: "Veuillez réessayer ultérieurement."
        });
      }
    });
  }, [withLoading]);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-6">
              <div className="space-y-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Réservation simple</span>
                <h2 className="text-3xl font-medium">Réservez votre table en quelques clics</h2>
                <p className="text-muted-foreground">
                  Sélectionnez une date dans le calendrier puis remplissez le formulaire pour effectuer votre réservation.
                </p>
              </div>
              
              <div className="flex items-center p-4 rounded-lg bg-secondary text-secondary-foreground">
                <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">Les réservations sont synchronisées automatiquement avec l'agenda du restaurant.</span>
              </div>
              
              <ReservationCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} className="mb-6" />
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <LoadingSpinner size="md" message="Envoi de votre réservation..." />
                </div>
              ) : (
                <ReservationForm 
                  selectedDate={selectedDate} 
                  on

Submit={handleReservationSubmit} 
                  isSubmitting={isLoading} 
                />
              )}
            </div>
            
            <div className="lg:w-1/3">
              <div className="sticky top-4 rounded-xl bg-secondary/50 p-6 space-y-4">
                <h3 className="text-xl font-medium">Informations importantes</h3>
                <div className="space-y-2 text-sm">
                  <p>• Les réservations sont disponibles jusqu'à 2 heures avant le service.</p>
                  <p>• Pour les groupes de plus de 8 personnes, veuillez nous contacter par téléphone.</p>
                  <p>• Une confirmation vous sera envoyée par email.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
