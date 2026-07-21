-- Fix: supprimer la politique d'écriture trop permissive sur route_prices
-- Les écritures passent désormais exclusivement via les API routes admin (service_role),
-- qui bypassent le RLS. Aucun utilisateur anonyme ne peut modifier les prix.
--
-- À exécuter dans : Supabase > SQL Editor

DROP POLICY IF EXISTS "Service write" ON route_prices;
