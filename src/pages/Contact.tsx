
import React from "react";
import Layout from "@/components/home/Layout";
import ContactForm from "@/components/contact/ContactForm";
import { useSEO } from "@/hooks/useSEO";

const Contact = () => {
  // Configure SEO for the contact page
  useSEO({
    title: "Reserv - Contactez-nous",
    description: "Contactez notre restaurant pour toute question ou demande spéciale. Notre équipe est à votre disposition pour vous répondre.",
    keywords: "contact restaurant, message restaurant, demande spéciale restaurant",
  });
  
  return (
    <Layout>
      <div className="py-16 md:py-24 px-4 bg-darkblack">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif text-gold mb-4">Contactez-nous</h1>
            <p className="text-cream/80 max-w-xl mx-auto font-light">
              Nous sommes à votre écoute. N'hésitez pas à nous contacter pour toute question 
              ou réservation particulière.
            </p>
          </div>
          
          <ContactForm />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 elegant-card">
              <h3 className="text-gold font-serif mb-3">Adresse</h3>
              <p className="text-cream/70 font-light">
                123 Rue de l'Étoile<br />
                Verdun, QC, H4G 2T7
              </p>
            </div>
            
            <div className="p-6 elegant-card">
              <h3 className="text-gold font-serif mb-3">Heures d'ouverture</h3>
              <p className="text-cream/70 font-light">
                Tous les jours<br />
                12h - 14h30 | 19h - 22h30
              </p>
            </div>
            
            <div className="p-6 elegant-card">
              <h3 className="text-gold font-serif mb-3">Téléphone</h3>
              <p className="text-cream/70 font-light">
                (514) 555-1234
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
