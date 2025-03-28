
import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="group elegant-card p-8 flex flex-col items-center text-center transition-all duration-500 hover:scale-[0.98] hover:bg-darkblack/80 hover:shadow-inner">
      <div className="bg-transparent border border-gold/30 p-4 rounded-full mb-6 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-darkblack">
        <Icon className="h-6 w-6 transition-colors duration-300 group-hover:text-darkblack" />
      </div>
      <h3 className="text-xl font-serif text-gold mb-4 transition-transform duration-300 group-hover:scale-105">{title}</h3>
      <p className="text-cream/70 font-light leading-relaxed transition-opacity duration-300 group-hover:text-cream">{description}</p>
    </div>
  );
};

export default FeatureCard;
