
import React from "react";
import { Phone, MapPin } from "lucide-react";
import ContactCard from "./ContactCard";

const ContactSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium mb-4">Nous contacter</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pour toute information ou réservation, n'hésitez pas à nous contacter par téléphone
            ou à utiliser notre système de réservation en ligne.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            description="15 Rue de la Gastronomie\n75008 Paris"
          >
            <p className="text-muted-foreground mb-4">
              <strong>Ouvert :</strong> Tous les jours de 12h à 14h30 et de 19h à 22h30
            </p>
            <p className="text-muted-foreground">
              <strong>Téléphone :</strong> 01 23 45 67 89
            </p>
          </ContactCard>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
