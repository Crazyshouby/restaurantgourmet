
import React from "react";
import { DollarSign } from "lucide-react";
import { MenuItem } from "@/types/menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItemDetailsDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const MenuItemDetailsDialog: React.FC<MenuItemDetailsDialogProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const isMobile = useIsMobile();
  
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${isMobile ? 'w-[calc(100%-24px)] p-4' : 'sm:max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className={isMobile ? 'space-y-1 mb-2' : ''}>
          <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>{item.name}</DialogTitle>
          <DialogDescription className="flex items-center text-sm text-muted-foreground mb-2">
            <span className="font-medium flex items-center">
              {parseFloat(item.price.toString()).toFixed(2)} <DollarSign className="ml-1 h-4 w-4" />
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className={`relative ${isMobile ? 'h-52' : 'h-64'} overflow-hidden bg-muted rounded-md mb-4`}>
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
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
        
        <div className={`${isMobile ? 'text-sm' : ''} text-muted-foreground`}>
          <p className="whitespace-pre-line">{item.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDetailsDialog;
