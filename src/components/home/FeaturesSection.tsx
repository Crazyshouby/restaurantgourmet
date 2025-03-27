
import React from "react";
import { Utensils, MapPin, Clock } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 animate-on-scroll">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-2">
            Nos services
          </span>
          <h2 className="text-3xl font-medium">Une expérience gastronomique complète</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Utensils}
            title="Cuisine raffinée"
            description="Des plats préparés avec soin par notre chef étoilé, utilisant les meilleurs produits du terroir."
            index={0}
          />
          
          <FeatureCard 
            icon={MapPin}
            title="Cadre exceptionnel"
            description="Un restaurant élégant au cœur de la ville, avec une terrasse donnant sur les jardins."
            index={1}
          />
          
          <FeatureCard 
            icon={Clock}
            title="Service attentionné"
            description="Notre équipe vous accueille tous les jours de 12h à 14h30 et de 19h à 22h30."
            index={2}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
