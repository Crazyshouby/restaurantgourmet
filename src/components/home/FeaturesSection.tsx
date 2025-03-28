
import React from "react";
import { Utensils, MapPin, Clock } from "lucide-react";
import FeatureCard from "./FeatureCard";
import { Separator } from "@/components/ui/separator";

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 bg-darkblack">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-gold mb-4">Notre service</h2>
          <Separator className="w-16 h-[1px] bg-gold/50 mx-auto my-6" />
          <p className="text-cream/80 max-w-xl mx-auto font-light">
            Une expérience gastronomique unique dans un cadre exceptionnel
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
