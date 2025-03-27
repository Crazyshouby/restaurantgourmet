
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
    <div className="bg-card rounded-xl p-8 shadow-card">
      <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5" /> {title}
      </h3>
      <p className="text-muted-foreground mb-6">
        {description}
      </p>
      {buttonText && buttonLink && (
        <Link to={buttonLink}>
          <Button className="w-full">
            {buttonText}
          </Button>
        </Link>
      )}
      {children}
    </div>
  );
};

export default ContactCard;
