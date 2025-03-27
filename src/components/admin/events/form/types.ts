
import { z } from "zod";
import { Event } from "@/types/events";

export const eventFormSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis" }),
  description: z.string().min(1, { message: "La description est requise" }),
  image: z.string().min(1, { message: "L'image est requise" }),
  date: z.string().min(1, { message: "La date est requise" }),
  time: z.string().min(1, { message: "L'heure est requise" }),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const createEventFromFormValues = (values: EventFormValues): Omit<Event, "id"> => {
  return {
    title: values.title,
    description: values.description,
    image: values.image,
    date: values.date,
    time: values.time,
  };
};
