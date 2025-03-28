
import React, { useEffect } from "react";
import Layout from "@/components/home/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";

// SEO metadata
const SEO = {
  title: "Reserv - Restaurant Gastronomique",
  description: "Découvrez notre restaurant gastronomique avec des plats d'exception préparés par notre chef étoilé. Réservez votre table dès maintenant.",
  keywords: "restaurant gastronomique, chef étoilé, cuisine française, réservation"
};

const Home = () => {
  // Mettre à jour le titre de la page pour le SEO
  useEffect(() => {
    document.title = SEO.title;
    
    // Ajouter les meta tags pour le SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", SEO.description);
    }
    
    // Précharger les routes importantes
    const links = [
      { rel: 'preload', as: 'image', href: '/placeholder.svg', importance: 'high' },
    ];
    
    links.forEach(linkData => {
      const link = document.createElement('link');
      Object.entries(linkData).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
      document.head.appendChild(link);
    });
    
    return () => {
      document.title = "Reserv - Réservation de Restaurant"; // Restaurer le titre par défaut
    };
  }, []);
  
  return (
    <Layout>
      {/* Charger toutes les sections directement plutôt qu'en lazy loading */}
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <ContactSection />
    </Layout>
  );
};

export default Home;
