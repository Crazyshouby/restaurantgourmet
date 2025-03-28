
import React from "react";
import { Edit, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MenuItem } from "@/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDeleteClick: (itemId: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onEdit, 
  onDeleteClick 
}) => {
  return (
    <Card key={item.id} className="overflow-hidden hover:shadow-sm transition-shadow">
      <div className="relative h-40 overflow-hidden bg-muted">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
            e.currentTarget.classList.add("p-6");
          }}
        />
        <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
          <span className="text-xs text-white font-medium px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
        {item.featured && (
          <span className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
            Spécialité
          </span>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-between p-4 pt-0 items-center">
        <span className="font-medium flex items-center">
          {item.price.toFixed(2)} <DollarSign className="ml-1 h-4 w-4" />
        </span>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log("Attempting to delete item:", item.id);
              onDeleteClick(item.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
