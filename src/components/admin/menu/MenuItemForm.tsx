
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { MenuItem } from "@/types/menu";
import MenuItemFormFields from "./form/MenuItemFormFields";
import MenuItemFormActions from "./form/MenuItemFormActions";
import { CATEGORIES, MenuItemFormValues, createMenuItemFromFormValues, menuItemFormSchema } from "./form/types";

interface MenuItemFormProps {
  initialData?: MenuItem;
  onSubmit: (data: Omit<MenuItem, "id">) => void;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      category: "Plats",
      image: "",
      featured: false,
    },
  });

  const handleSubmit = (values: MenuItemFormValues) => {
    const menuItem = createMenuItemFromFormValues(values);
    onSubmit(menuItem);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <MenuItemFormFields 
          form={form}
          categories={CATEGORIES}
        />
        
        <MenuItemFormActions 
          onCancel={onCancel}
          isEditing={!!initialData}
        />
      </form>
    </Form>
  );
};

export default MenuItemForm;
