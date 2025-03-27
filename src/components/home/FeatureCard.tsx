
import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, index = 0 }) => {
  return (
    <div 
      className="glass rounded-xl p-6 shadow-card flex flex-col items-center text-center transform transition-all duration-500 hover:translate-y-[-5px] animate-on-scroll"
      style={{ animationDelay: `${0.1 * (index + 1)}s` }}
    >
      <div className="bg-primary/10 p-3 rounded-full mb-4 animate-pulse-subtle">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
