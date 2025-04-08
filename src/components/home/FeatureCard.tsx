
import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="group elegant-card p-8 flex flex-col items-center text-center transition-all duration-500 hover:border-gold/50 hover:shadow-gold shadow-none">
      <div className="bg-transparent border border-gold/30 p-4 rounded-full mb-6 text-gold group-hover:border-gold group-hover:bg-gold/5 transition-all duration-300">
        <Icon className="h-6 w-6 text-gold" />
      </div>
      <h3 className="text-xl font-serif text-gold mb-4">{title}</h3>
      <p className="text-cream/70 font-light leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
