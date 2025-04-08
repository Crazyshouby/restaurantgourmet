
import React from "react";
import Layout from "@/components/home/Layout";
import Slideshow from "@/components/home/Slideshow";
import FeaturesSection from "@/components/home/FeaturesSection";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";
import { useSEO } from "@/hooks/useSEO";

const Home = () => {
  // Configuration SEO pour la page d'accueil
  useSEO({
    title: "Reserv - Restaurant Gastronomique",
    description: "Découvrez notre restaurant gastronomique avec des plats d'exception préparés par notre chef étoilé. Réservez votre table dès maintenant.",
    keywords: "restaurant gastronomique, chef étoilé, cuisine française, réservation",
    preloadLinks: [
      { rel: 'preload', as: 'image', href: '/placeholder.svg', importance: 'high' },
    ]
  });
  
  return (
    <Layout>
      <Slideshow />
      <FeaturesSection />
      <AboutSection />
      <ContactSection />
    </Layout>
  );
};

export default Home;
