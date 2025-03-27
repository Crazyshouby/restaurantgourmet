
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
  index?: number;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  buttonLink,
  children,
  index = 0
}) => {
  return (
    <div 
      className="glass rounded-xl p-8 shadow-card transform transition-all duration-500 hover:translate-y-[-5px] animate-on-scroll"
      style={{ animationDelay: `${0.2 * (index + 1)}s` }}
    >
      <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" /> {title}
      </h3>
      <p className="text-muted-foreground mb-6">
        {description}
      </p>
      {buttonText && buttonLink && (
        <Link to={buttonLink}>
          <Button className="w-full btn-animated bg-gradient-to-r from-primary to-primary/90">
            {buttonText}
          </Button>
        </Link>
      )}
      {children}
    </div>
  );
};

export default ContactCard;
