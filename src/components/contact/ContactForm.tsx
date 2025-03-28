
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Mail, User, Phone } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  phone: z.string().min(10, { message: "Veuillez entrer un numéro de téléphone valide" }),
  message: z.string().min(10, { message: "Votre message doit contenir au moins 10 caractères" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with react-hook-form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Send message to database 
      // This would typically be replaced with a proper backend endpoint
      // For now, we'll just simulate success
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success("Votre message a été envoyé ! Nous vous répondrons dans les plus brefs délais.");
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="elegant-card p-8 md:p-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold">Nom</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Votre nom" 
                        {...field} 
                        className="pl-10" 
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="votre@email.com" 
                        type="email" 
                        {...field} 
                        className="pl-10" 
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gold">Téléphone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="(514) 555-6789" 
                      type="tel" 
                      {...field} 
                      className="pl-10" 
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gold">Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Votre message ici..." 
                    {...field} 
                    className="min-h-32 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? (
              <>
                <span className="animate-pulse">Envoi en cours...</span>
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
