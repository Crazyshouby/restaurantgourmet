
import React from "react";
import { Utensils, MapPin, Clock } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Utensils}
            title="Cuisine raffinée"
            description="Des plats préparés avec soin par notre chef étoilé, utilisant les meilleurs produits du terroir."
          />
          
          <FeatureCard 
            icon={MapPin}
            title="Cadre exceptionnel"
            description="Un restaurant élégant au cœur de la ville, avec une terrasse donnant sur les jardins."
          />
          
          <FeatureCard 
            icon={Clock}
            title="Service attentionné"
            description="Notre équipe vous accueille tous les jours de 12h à 14h30 et de 19h à 22h30."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
