
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
      // Vérifier si l'utilisateur est un administrateur dans la table admin_users
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('username')
        .eq('username', username)
        .single();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error("Erreur lors de la vérification de l'administrateur:", adminError.message);
        toast.error("Erreur d'authentification", {
          description: "Une erreur est survenue lors de la vérification des identifiants."
        });
        return { success: false, error: adminError };
      }

      // Si l'utilisateur est un administrateur, procéder à l'authentification
      if (adminUser) {
        if (password !== 'admin') {
          toast.error("Échec de connexion", {
            description: "Mot de passe incorrect pour l'administrateur."
          });
          return { success: false, error: { message: "Mot de passe incorrect" } };
        }

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
