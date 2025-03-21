
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Configuration CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Gestion des requêtes préliminaires CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupération des données de l'email
    const { to, subject, html } = await req.json();
    
    if (!to || !subject || !html) {
      throw new Error("Données d'email incomplètes");
    }

    // Envoi de l'email via l'API de Supabase
    const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/auth/v1/admin/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        email: to,
        subject: subject,
        template_data: { html: html }
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Erreur de l'API d'envoi d'email:", errorData);
      throw new Error(`Erreur d'envoi d'email: ${JSON.stringify(errorData)}`);
    }

    console.log(`Email envoyé avec succès à ${to}`);

    return new Response(
      JSON.stringify({ success: true, message: "Email envoyé avec succès" }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Erreur dans la fonction resend-email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Une erreur est survenue lors de l'envoi de l'email"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
