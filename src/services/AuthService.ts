
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
  },

  signIn: async (username: string, password: string) => {
    try {
      // Vérification des identifiants pour l'administrateur
      if (username === 'webllingtonadmin' || username === 'webllingtonpass') {
        // Utilisation de signInWithPassword avec le nom d'utilisateur comme email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password
        });

        if (error) {
          console.error("Erreur d'authentification admin:", error.message);
          toast.error("Échec de connexion", {
            description: "Nom d'utilisateur ou mot de passe incorrect."
          });
          return { success: false, error };
        }

        toast.success("Connexion administrateur réussie", {
          description: "Vous êtes maintenant connecté en tant qu'administrateur."
        });
        return { success: true, data };
      } else {
        // Pour d'autres utilisateurs, gestion normale par email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password
        });

        if (error) {
          console.error("Erreur d'authentification:", error.message);
          toast.error("Échec de connexion", {
            description: "Email ou mot de passe incorrect."
          });
          return { success: false, error };
        }

        toast.success("Connexion réussie", {
          description: "Vous êtes maintenant connecté."
        });
        return { success: true, data };
      }
    } catch (error) {
      console.error("Exception lors de l'authentification:", error);
      toast.error("Erreur système", {
        description: "Une erreur est survenue lors de la connexion."
      });
      return { success: false, error };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erreur lors de la déconnexion:", error.message);
        toast.error("Échec de déconnexion", {
          description: "Une erreur est survenue lors de la déconnexion."
        });
        return false;
      }
      
      toast.success("Déconnexion réussie", {
        description: "Vous êtes maintenant déconnecté."
      });
      return true;
    } catch (error) {
      console.error("Exception lors de la déconnexion:", error);
      toast.error("Erreur système", {
        description: "Une erreur est survenue lors de la déconnexion."
      });
      return false;
    }
  }
};
