
import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  children?: React.ReactNode;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  buttonLink,
  children 
}) => {
  return (
    <div className="elegant-card p-8 flex flex-col hover:shadow-gold shadow-none transition-all duration-300">
      <h3 className="text-xl font-serif mb-6 flex items-center gap-3 text-gold">
        <div className="border border-gold/30 p-2 rounded-full">
          <Icon className="h-5 w-5 text-gold" />
        </div>
        {title}
      </h3>
      <p className="text-cream/70 mb-6 font-light whitespace-pre-line">
        {description}
      </p>
      {children}
      {buttonText && buttonLink && (
        <Link to={buttonLink} className="mt-auto pt-4">
          <Button className="w-full bg-gold hover:bg-gold/90 text-darkblack rounded-none font-light tracking-wide text-sm">
            {buttonText}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ContactCard;
