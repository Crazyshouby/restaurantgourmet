
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

    // Appel direct à l'API d'envoi d'email de Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const emailResponse = await fetch(`${supabaseUrl}/auth/v1/admin/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        email: email,
        subject: emailSubject,
        template_data: { 
          body: emailContent 
        }
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Erreur de l'API d'envoi d'email:", errorData);
      throw new Error(`Erreur d'envoi d'email: ${JSON.stringify(errorData)}`);
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
