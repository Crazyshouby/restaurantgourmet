
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Event } from "@/types/events";
import EventsList from "./EventsList";
import EventForm from "./EventForm";
import EventDialog from "./EventDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EventsAdminContainerProps {
  events: Event[];
  isLoading: boolean;
  onAddEvent: (newEvent: Omit<Event, "id">) => void;
  onUpdateEvent: (updatedEvent: Event) => void;
  onDeleteEvent: (eventId: string) => Promise<any>;
}

const EventsAdminContainer: React.FC<EventsAdminContainerProps> = ({
  events,
  isLoading,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showHeroEvent, setShowHeroEvent] = useState(true);
  const [isToggleLoading, setIsToggleLoading] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('show_hero_event')
          .single();
        
        if (error) throw error;
        
        setShowHeroEvent(data?.show_hero_event ?? true);
      } catch (error) {
        console.error('Error fetching show_hero_event setting:', error);
      }
    };

    fetchSetting();
  }, []);

  const handleToggleChange = async (checked: boolean) => {
    setIsToggleLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ show_hero_event: checked })
        .eq('id', 1);
      
      if (error) throw error;
      
      setShowHeroEvent(checked);
      toast.success(checked 
        ? "L'événement sera affiché dans la section héro" 
        : "L'événement n'apparaîtra plus dans la section héro"
      );
    } catch (error) {
      console.error('Error updating show_hero_event setting:', error);
      toast.error("Erreur lors de la mise à jour du paramètre");
    } finally {
      setIsToggleLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    console.log("[CONTAINER] Suppression de l'événement:", eventId);
    
    try {
      console.log("[CONTAINER] Appel de onDeleteEvent");
      const result = await onDeleteEvent(eventId);
      console.log("[CONTAINER] Suppression réussie, résultat:", result);
      return true;
    } catch (error) {
      console.error("[CONTAINER] Erreur lors de la suppression:", error);
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Switch
            id="hero-event-toggle"
            checked={showHeroEvent}
            onCheckedChange={handleToggleChange}
            disabled={isToggleLoading}
          />
          <Label htmlFor="hero-event-toggle" className="cursor-pointer">
            {showHeroEvent ? "Événement visible sur la page d'accueil" : "Événement masqué sur la page d'accueil"}
          </Label>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
        </Button>
      </div>

      <EventsList 
        events={events} 
        isLoading={isLoading}
        onUpdateEvent={onUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      <EventDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        title="Ajouter un nouvel événement"
        description="Complétez le formulaire pour ajouter un événement."
      >
        <EventForm 
          onSubmit={(formData) => {
            onAddEvent(formData);
            setIsAddDialogOpen(false);
          }}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </EventDialog>
    </div>
  );
};

export default EventsAdminContainer;
