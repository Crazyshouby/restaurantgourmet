
import React from "react";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { MenuItem } from "@/types/menu";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onClick }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer touch-manipulation"
      onClick={() => onClick(item)}
    >
      <div className={`relative ${isMobile ? 'h-36' : 'h-48'} overflow-hidden bg-muted`}>
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
            e.currentTarget.classList.add("p-6");
          }}
        />
        {item.featured && (
          <span className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
            Spécialité
          </span>
        )}
        <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
          <span className="text-xs text-white font-medium px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
      </div>
      <CardContent className={`p-3 md:p-4`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} mb-1 md:mb-2`}>{item.name}</CardTitle>
        <CardDescription className={`${isMobile ? 'h-16 text-sm' : 'h-20'} overflow-hidden`}>
          {item.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between p-3 md:p-4 pt-0 items-center">
        <span className="font-medium text-primary flex items-center">
          {parseFloat(item.price.toString()).toFixed(2)} <DollarSign className="ml-1 h-4 w-4" />
        </span>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
