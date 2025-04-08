
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = "Reserv - Réservation de Restaurant",
  description = "Application de réservation de restaurant avec synchronisation Google Calendar" 
}) => {
  const location = useLocation();
  
  // Mettre à jour les métadonnées de la page quand le composant est monté
  useEffect(() => {
    // Mise à jour du titre et de la description pour le SEO
    document.title = title;
    
    // Mettre à jour la description si l'élément meta existe
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
    
    // Suivre les changements de page pour l'analytics (si implémenté)
    console.log(`Page consultée : ${location.pathname}`);
    
    // Scroll au début de la page lors du changement de route
    window.scrollTo(0, 0);
  }, [title, description, location.pathname]);

  return (
    <div className="min-h-screen bg-darkblack flex flex-col">
      <Header />
      <main className="animate-fade-in flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
