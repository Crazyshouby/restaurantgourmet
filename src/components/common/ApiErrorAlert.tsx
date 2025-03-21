
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

interface ApiErrorAlertProps {
  title?: string;
  description: string;
  className?: string;
}

const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({
  title = "Erreur",
  description,
  className
}) => {
  return (
    <Alert variant="destructive" className={className}>
      <XCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default ApiErrorAlert;
