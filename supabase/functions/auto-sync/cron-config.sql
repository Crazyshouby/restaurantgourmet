
-- Ce fichier n'est pas exécuté automatiquement, il est fourni comme référence pour configurer le cron job
-- Pour activer le cron job, exécutez le contenu de ce fichier dans l'éditeur SQL de Supabase

-- Activer les extensions nécessaires pour les cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Configurer un cron job pour exécuter la synchronisation toutes les 5 minutes
SELECT cron.schedule(
  'auto-sync-reservations',
  '*/5 * * * *', -- Toutes les 5 minutes
  $$
  SELECT net.http_post(
    url:='https://jmgzpeubdaemrxvsmwss.supabase.co/functions/v1/auto-sync',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer [VOTRE_ANON_KEY]"}'::jsonb,
    body:='{}'::jsonb
  ) as request_id;
  $$
);

-- Pour annuler ce job, exécutez:
-- SELECT cron.unschedule('auto-sync-reservations');
