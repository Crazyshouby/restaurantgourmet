import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { format, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { useEventsQuery } from "@/hooks/events/useEventsQueries";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

// Images de haute qualité pour le diaporama
const SLIDES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    title: "Une cuisine d'exception",
    subtitle: "Notre chef vous propose une expérience gastronomique unique"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    title: "Ambiance élégante",
    subtitle: "Un cadre raffiné pour vos moments les plus précieux"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    title: "Plats savoureux",
    subtitle: "Des produits frais et de saison sélectionnés avec soin"
  }
];

const Slideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHeroEvent, setShowHeroEvent] = useState(true);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { data: events = [], isLoading } = useEventsQuery();
  const isMobile = useIsMobile();

  // Fetch the admin setting
  useEffect(() => {
    const fetchShowHeroSetting = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('show_hero_event')
          .single();
        
        if (error) throw error;
        
        // If the setting exists, use it; otherwise default to true
        setShowHeroEvent(data?.show_hero_event ?? true);
      } catch (error) {
        console.error('Error fetching show_hero_event setting:', error);
        // On error, default to showing the event
        setShowHeroEvent(true);
      }
    };

    fetchShowHeroSetting();
  }, []);

  // Trouver le prochain événement à venir
  const getNextEvent = () => {
    if (events.length === 0) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filtrer les événements pour ne garder que ceux à venir
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return isAfter(eventDate, today) || format(eventDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    });
    
    // Trier par date (du plus proche au plus éloigné)
    upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Retourner le premier événement (le plus proche)
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  };
  
  const nextEvent = getNextEvent();

  // Configuration des références pour chaque image pour l'effet de parallax
  useEffect(() => {
    parallaxRefs.current = parallaxRefs.current.slice(0, SLIDES.length);
  }, []);

  // Effet de parallax sur le mouvement de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20; // Réduire l'amplitude du mouvement
      const y = (clientY / window.innerHeight - 0.5) * 20; // Réduire l'amplitude du mouvement

      parallaxRefs.current.forEach((ref, index) => {
        if (ref && index === currentSlide) {
          // Appliquer une transformation plus légère pour un effet subtil
          ref.style.transform = `translate(${-x / 4}px, ${-y / 4}px) scale(1.1)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentSlide]);

  // Navigation automatique
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000); // Change d'image toutes les 5 secondes
    
    return () => clearInterval(interval);
  }, [currentSlide]);

  const goToNextSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    
    // Reset de l'état d'animation
    setTimeout(() => setIsAnimating(false), 750);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    
    setIsAnimating(true);
    setCurrentSlide(index);
    
    // Reset de l'état d'animation
    setTimeout(() => setIsAnimating(false), 750);
  };

  // Formater la date de l'événement en français
  const formatEventDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "d MMMM yyyy", { locale: fr });
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-darkblack">
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out",
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Image de fond avec overlay et effet parallax */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div 
              ref={el => parallaxRefs.current[index] = el}
              className="w-full h-full transition-transform duration-200 ease-out scale-110"
              style={{ 
                backgroundImage: `url(${slide.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="absolute inset-0 bg-darkblack/50"></div>
          </div>
          
          {/* Contenu du slide - Déplacé encore plus haut (75px de plus) */}
          <div className="relative z-20 h-full flex flex-col justify-center items-center px-4 text-center">
            <div className="max-w-4xl mx-auto animate-fade-in mt-[-175px] md:mt-[-225px]">
              <span className="inline-block px-4 py-1 border border-gold text-gold text-xs tracking-widest uppercase">
                Une expérience inoubliable
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-cream mt-3">
                {slide.title} <span className="text-gold italic">exceptionnelle</span>
              </h2>
              <p className="text-cream/80 text-lg font-light leading-relaxed max-w-2xl mx-auto mt-3">
                {slide.subtitle}
              </p>
            </div>
          </div>
          
          {/* Nouvelle div pour les boutons positionnés à gauche, alignés avec la carte événement */}
          <div className="absolute bottom-32 left-6 md:left-12 z-30 animate-fade-in hidden md:block">
            <div className="flex flex-col gap-4">
              <Link to="/reservations">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-darkblack rounded-none px-8 font-light tracking-wide text-sm group w-full">
                  Réserver une table 
                  <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="outline" size="lg" className="border-gold text-gold hover:bg-gold/10 rounded-none px-8 font-light tracking-wide text-sm w-full">
                  Voir le menu
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Boutons pour mobile, centrés en bas */}
          <div className="flex flex-wrap justify-center gap-4 absolute bottom-32 left-0 right-0 z-30 px-4 md:hidden">
            <Link to="/reservations">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-darkblack rounded-none px-8 font-light tracking-wide text-sm group">
                Réserver une table 
                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="outline" size="lg" className="border-gold text-gold hover:bg-gold/10 rounded-none px-8 font-light tracking-wide text-sm">
                Voir le menu
              </Button>
            </Link>
          </div>
        </div>
      ))}
      
      {/* Affichage du prochain événement - conditionnellement basé sur le paramètre showHeroEvent et non-mobile */}
      {nextEvent && showHeroEvent && !isMobile && (
        <div className="absolute bottom-32 right-6 md:right-12 z-30 max-w-xs md:max-w-sm animate-fade-in">
          <Card className="overflow-hidden border border-gold/30 bg-darkblack/80 backdrop-blur-sm text-left shadow-lg hover:shadow-gold/20 transition-all duration-300">
            {/* Ajout de l'image de l'événement */}
            <div className="h-32 overflow-hidden">
              <img 
                src={nextEvent.image} 
                alt={nextEvent.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                  e.currentTarget.classList.add("p-6");
                }}
              />
            </div>
            <div className="pt-2 px-3">
              <span className="inline-block px-2 py-0.5 bg-gold/20 text-gold text-xs tracking-widest uppercase rounded-sm">
                Prochain événement
              </span>
            </div>
            <Link to="/events" className="block p-3 group">
              <h3 className="font-serif text-lg text-cream group-hover:text-gold transition-colors line-clamp-2">{nextEvent.title}</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center text-sm text-cream/80">
                  <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-gold" />
                  {formatEventDate(nextEvent.date)}
                </div>
                <div className="flex items-center text-sm text-cream/80">
                  <Clock className="mr-1.5 h-3.5 w-3.5 text-gold" />
                  {nextEvent.time}
                </div>
              </div>
              <div className="mt-1.5 flex justify-end">
                <span className="text-xs text-gold group-hover:translate-x-0.5 transition-transform">
                  Voir tous les événements →
                </span>
              </div>
            </Link>
          </Card>
        </div>
      )}
      
      {/* Indicateurs de slide */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide 
                ? "bg-gold w-6" 
                : "bg-cream/30 hover:bg-cream/50"
            )}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Slideshow;
