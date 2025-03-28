
import React, { lazy, Suspense, useEffect } from "react";
import Layout from "@/components/home/Layout";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Lazy loading des sections moins critiques
const HeroSection = lazy(() => import("@/components/home/HeroSection"));
const FeaturesSection = lazy(() => import("@/components/home/FeaturesSection"));
const AboutSection = lazy(() => import("@/components/home/AboutSection"));
const ContactSection = lazy(() => import("@/components/home/ContactSection"));

// SEO metadata
const SEO = {
  title: "Reserv - Restaurant Gastronomique",
  description: "Découvrez notre restaurant gastronomique avec des plats d'exception préparés par notre chef étoilé. Réservez votre table dès maintenant.",
  keywords: "restaurant gastronomique, chef étoilé, cuisine française, réservation"
};

// Composant avec fallback pour les sections en lazy loading
const SectionLoader = () => (
  <div className="flex justify-center items-center py-20">
    <LoadingSpinner />
  </div>
);

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
      {/* La section Hero est chargée immédiatement car c'est la plus visible */}
      <HeroSection />
      
      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <AboutSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <ContactSection />
      </Suspense>
    </Layout>
  );
};

export default Home;
