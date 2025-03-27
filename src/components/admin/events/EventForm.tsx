
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Event } from "@/types/events";
import EventFormFields from "./form/EventFormFields";
import EventFormActions from "./form/EventFormActions";
import { EventFormValues, createEventFromFormValues, eventFormSchema } from "./form/types";

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: Omit<Event, "id">) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      image: "",
      date: "",
      time: "",
    },
  });

  const handleSubmit = (values: EventFormValues) => {
    const event = createEventFromFormValues(values);
    onSubmit(event);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <EventFormFields form={form} />
        
        <EventFormActions 
          onCancel={onCancel}
          isEditing={!!initialData}
        />
      </form>
    </Form>
  );
};

export default EventForm;
