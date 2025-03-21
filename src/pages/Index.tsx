
import React, { useState } from "react";
import { toast } from "sonner";
import ReservationCalendar from "@/components/ReservationCalendar";
import ReservationForm from "@/components/ReservationForm";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { ReservationService } from "@/services/ReservationService";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReservationSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
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
        description: `Votre table est réservée pour le ${format(reservationDateTime, "d MMMM à HH:mm", { locale: fr })}`,
      });
      
      // Réinitialiser le formulaire
      setSelectedDate(undefined);
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      toast.error("Erreur lors de la réservation", {
        description: "Veuillez réessayer ultérieurement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-medium">Reserv</h1>
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              Administration
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            <div className="lg:w-1/2 space-y-6">
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
              
              <ReservationForm 
                selectedDate={selectedDate}
                onSubmit={handleReservationSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
            
            <div className="lg:w-1/2">
              <ReservationCalendar 
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                className="sticky top-4"
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t mt-16">
        <div className="container mx-auto py-6 px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Restaurant App. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
