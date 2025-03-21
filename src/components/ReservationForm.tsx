
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { DailyAvailability } from "@/types";

interface ReservationFormProps {
  selectedDate: Date | undefined;
  onSubmit: (formData: any) => void;
  isSubmitting: boolean;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  selectedDate,
  onSubmit,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    time: "",
    guests: "2",
    notes: ""
  });
  
  const [timeSlots, setTimeSlots] = useState<string[]>([
    "12:00", "12:30", "13:00", "13:30", 
    "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ]);
  
  const [dailyAvailability, setDailyAvailability] = useState<DailyAvailability | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  useEffect(() => {
    // Load time slots from admin settings
    const loadTimeSlots = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('time_slots')
          .eq('id', 1)
          .single();
        
        if (!error && data && data.time_slots && data.time_slots.length > 0) {
          setTimeSlots(data.time_slots);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des plages horaires:", error);
      }
    };
    
    loadTimeSlots();
  }, []);

  useEffect(() => {
    // Check availability when date changes
    if (selectedDate) {
      checkDailyAvailability(selectedDate);
    }
  }, [selectedDate]);

  const checkDailyAvailability = async (date: Date) => {
    if (!date) return;
    
    setIsCheckingAvailability(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Get max capacity from settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('admin_settings')
        .select('max_guests_per_day')
        .eq('id', 1)
        .single();
      
      if (settingsError) {
        throw settingsError;
      }
      
      const maxCapacity = settingsData.max_guests_per_day || 20;
      
      // Get current reservations for the day
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select('guests')
        .eq('date', dateStr);
      
      if (reservationsError) {
        throw reservationsError;
      }
      
      // Calculate total guests already booked
      const bookedGuests = reservationsData.reduce((total, reservation) => total + reservation.guests, 0);
      const remainingCapacity = Math.max(0, maxCapacity - bookedGuests);
      
      setDailyAvailability({
        date: dateStr,
        remainingCapacity,
        totalCapacity: maxCapacity
      });
      
    } catch (error) {
      console.error("Erreur lors de la vérification de la disponibilité:", error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error("Veuillez sélectionner une date");
      return;
    }
    
    if (!formData.time) {
      toast.error("Veuillez sélectionner une heure");
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Check if requested number of guests exceeds available capacity
    const guestsNum = parseInt(formData.guests);
    if (dailyAvailability && guestsNum > dailyAvailability.remainingCapacity) {
      toast.error("Capacité insuffisante", {
        description: `Il ne reste que ${dailyAvailability.remainingCapacity} places disponibles pour cette date.`
      });
      return;
    }
    
    onSubmit({
      ...formData,
      date: selectedDate,
      guests: guestsNum
    });
  };

  return (
    <Card className="w-full animate-fade-in shadow-card">
      <CardHeader>
        <CardTitle>Réservation</CardTitle>
        <CardDescription>
          {selectedDate 
            ? `Pour le ${format(selectedDate, "d MMMM yyyy", { locale: fr })}` 
            : "Veuillez d'abord sélectionner une date"
          }
          {dailyAvailability && (
            <div className="mt-2 text-sm">
              <span className={dailyAvailability.remainingCapacity < 5 ? "text-amber-500 font-medium" : ""}>
                {dailyAvailability.remainingCapacity} places disponibles sur {dailyAvailability.totalCapacity}
              </span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Votre nom" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="votre@email.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="06 XX XX XX XX" 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("time", value)}
                value={formData.time}
              >
                <SelectTrigger id="time">
                  <SelectValue placeholder="Sélectionner une heure" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">Nombre de personnes *</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("guests", value)}
                value={formData.guests}
              >
                <SelectTrigger id="guests">
                  <SelectValue placeholder="Nombre de personnes" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem 
                      key={num} 
                      value={num.toString()}
                      disabled={dailyAvailability && num > dailyAvailability.remainingCapacity}
                    >
                      {num} {num > 1 ? 'personnes' : 'personne'}
                      {dailyAvailability && num > dailyAvailability.remainingCapacity && 
                        " (capacité dépassée)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes ou demandes spéciales</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="Allergies, préférences de table, etc." 
              rows={3} 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full transition-all" 
            disabled={isSubmitting || !selectedDate || isCheckingAvailability || 
              (dailyAvailability && dailyAvailability.remainingCapacity <= 0)}
          >
            {isSubmitting ? "Envoi en cours..." : 
             !selectedDate ? "Sélectionnez une date" :
             dailyAvailability && dailyAvailability.remainingCapacity <= 0 ? "Complet pour cette date" :
             "Confirmer la réservation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReservationForm;
