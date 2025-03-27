
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (titleRef.current) {
      const titleElement = titleRef.current;
      const words = titleElement.innerText.split(' ');
      
      titleElement.innerHTML = '';
      words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'text-animated opacity-0 animate-fade-in';
        wordSpan.style.setProperty('--word-index', index.toString());
        wordSpan.textContent = (index < words.length - 1) ? `${word} ` : word;
        titleElement.appendChild(wordSpan);
      });
    }
  }, []);

  return (
    <section className="relative py-20 px-4 animated-bg">
      <div className="texture-overlay"></div>
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm animate-fade-in">
              Une expérience inoubliable
            </span>
            <h2 
              ref={titleRef} 
              className="text-4xl md:text-5xl font-medium leading-tight"
            >
              Découvrez une cuisine d'exception
            </h2>
            <p className="paragraph opacity-0 animate-fade-in" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
              Notre chef vous propose une carte élaborée avec des produits frais et de saison,
              pour une expérience culinaire unique.
            </p>
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in" style={{animationDelay: '0.8s', animationFillMode: 'forwards'}}>
              <Link to="/reservations">
                <Button 
                  size="lg" 
                  className="btn-animated group bg-gradient-to-r from-primary to-primary/90"
                >
                  Réserver une table 
                  <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="btn-animated backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 border-white/20 dark:border-gray-800/20"
                >
                  Voir le menu
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-[1.02] opacity-0 animate-fade-in" style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Plat gastronomique" 
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
