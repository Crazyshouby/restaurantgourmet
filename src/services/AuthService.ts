
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
      // Vérifier d'abord s'il y a une session admin dans localStorage
      const adminSessionStr = localStorage.getItem('admin_session');
      if (adminSessionStr) {
        try {
          const adminSession = JSON.parse(adminSessionStr);
          return adminSession;
        } catch (e) {
          console.error("Erreur lors du parsing de la session admin:", e);
          localStorage.removeItem('admin_session');
        }
      }

      // Ensuite, vérifier la session Supabase
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
      console.log("Tentative de connexion avec:", username);
      
      // Admin login spécifique
      if (username === 'webllington') {
        console.log("Tentative de connexion admin pour:", username);
        
        // Vérifier si le mot de passe est correct
        if (password !== 'admin') {
          console.log("Mot de passe admin incorrect");
          toast.error("Échec de connexion", {
            description: "Mot de passe incorrect pour l'administrateur."
          });
          return { success: false, error: { message: "Mot de passe incorrect" } };
        }
        
        console.log("Authentification admin réussie");
        // Authentification réussie pour l'administrateur
        toast.success("Connexion administrateur réussie", {
          description: "Vous êtes maintenant connecté en tant qu'administrateur."
        });
        
        // Créer une session sans utiliser Supabase Auth
        const adminSession = {
          user: {
            id: 'admin',
            email: username,
            role: 'admin'
          }
        };
        
        // Stocker la session dans localStorage
        localStorage.setItem('admin_session', JSON.stringify(adminSession));
        
        return { success: true, data: adminSession };
      } else {
        // Pour les utilisateurs non-administrateurs, authentification normale par email
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
      // Vérifier si c'est une session admin stockée localement
      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        localStorage.removeItem('admin_session');
        toast.success("Déconnexion réussie", {
          description: "Vous êtes maintenant déconnecté."
        });
        return true;
      }
      
      // Sinon, déconnexion normale via Supabase
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
