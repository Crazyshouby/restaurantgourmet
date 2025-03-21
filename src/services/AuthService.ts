
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AuthService = {
  setupAuthListener: () => {
    console.log('Configuration du listener pour l\'authentification...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.provider_token) {
          console.log('Utilisateur connecté avec un provider_token');
        }
      }
    );
    
    return subscription;
  },
  
  getSession: async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      return sessionData.session;
    } catch (error) {
      console.error("Erreur lors de la récupération de la session:", error);
      toast.error("Erreur d'authentification", {
        description: "Impossible de récupérer les informations de session."
      });
      return null;
    }
  }
};
