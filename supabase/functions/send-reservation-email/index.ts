
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    // Récupération des données de la réservation
    const { email, name, date, time, guests, notes, phone } = await req.json();
    
    if (!email || !name || !date || !time) {
      throw new Error("Données de réservation incomplètes");
    }

    // Création du client Supabase avec la clé de service pour les tâches administratives
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Construction du contenu de l'email
    const emailSubject = "Confirmation de votre réservation";
    const emailContent = `
      <h1>Confirmation de réservation</h1>
      <p>Bonjour ${name},</p>
      <p>Nous confirmons votre réservation pour le ${date} à ${time}.</p>
      <p>Détails de la réservation :</p>
      <ul>
        <li>Nombre de personnes : ${guests}</li>
        <li>Téléphone : ${phone || email}</li>
        ${notes ? `<li>Notes : ${notes}</li>` : ''}
      </ul>
      <p>Nous nous réjouissons de vous accueillir!</p>
      <p>L'équipe du restaurant</p>
    `;

    // Envoi de l'email via la fonction interne de Supabase
    const { error } = await supabaseAdmin.functions.invoke('resend-email', {
      body: {
        to: email,
        subject: emailSubject,
        html: emailContent,
      }
    });

    if (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw error;
    }

    console.log(`Email de confirmation envoyé à ${email} pour la réservation du ${date} à ${time}`);

    return new Response(
      JSON.stringify({ success: true, message: "Email de confirmation envoyé" }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Erreur dans la fonction send-reservation-email:", error);
    
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
