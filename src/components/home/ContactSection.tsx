
import React from "react";
import { Phone, MapPin } from "lucide-react";
import ContactCard from "./ContactCard";
import { Separator } from "@/components/ui/separator";

const ContactSection = () => {
  return (
    <section className="py-24 px-4 bg-darkblack">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-gold mb-4">Nous contacter</h2>
          <Separator className="w-16 h-[1px] bg-gold/50 mx-auto my-6" />
          <p className="text-cream/80 max-w-xl mx-auto font-light">
            Pour toute information ou réservation, n'hésitez pas à nous contacter par téléphone
            ou à utiliser notre système de réservation en ligne.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ContactCard 
            icon={Phone}
            title="Réservations"
            description="Pour réserver une table, appelez-nous ou utilisez notre système de réservation en ligne."
            buttonText="Réserver maintenant"
            buttonLink="/reservations"
          />
          
          <ContactCard 
            icon={MapPin}
            title="Adresse"
            description="123 Rue de l'Étoile\nVerdun, QC, H4G 2T7"
          >
            <p className="text-cream/70 mb-4 font-light">
              <strong className="text-gold font-normal">Ouvert :</strong> Tous les jours de 12h à 14h30 et de 19h à 22h30
            </p>
            <p className="text-cream/70 font-light">
              <strong className="text-gold font-normal">Téléphone :</strong> (514) 555-1234
            </p>
          </ContactCard>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
