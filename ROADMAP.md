# Roadmap — Moveo Taxi

Légende : ✅ Fait · 🔄 En cours · ⬜ À faire · 🔮 Phase future

---

## Phase 1 — MVP (site fonctionnel)

### Infrastructure
- ✅ Setup Next.js 16 + next-intl v4 + Tailwind CSS v4
- ✅ Routing i18n (`proxy.ts`) — 5 locales avec préfixe always
- ✅ Support RTL complet pour l'hébreu
- ✅ Police Heebo unifiée (hébreu + latin)
- ✅ Variables de couleur globales (vert #16A34A, orange #F97316)
- ✅ Déploiement local fonctionnel (`npm run dev`)
- ✅ Déploiement Vercel — https://moveo-taxi.vercel.app
- ⬜ Domaine `.co.il` configuré

### Pages
- ✅ Page d'accueil — Hero Uber/Bolt style (image fond + overlay sombre + widget)
- ✅ Page aéroport (`/airport`)
- ✅ Page trajets inter-villes (`/routes`)
- ✅ Page à propos (`/about`)
- ✅ Page contact (`/contact`)
- ✅ Page chauffeurs (`/drivers`)
- ✅ Page réservation (`/booking`)
- ✅ Page confirmation (`/confirmation/[id]`)
- ✅ Pages légales (`/privacy`, `/terms`)
- ✅ Panel admin (`/admin`)

### Composants
- ✅ Navbar (sticky, responsive, menu mobile)
- ✅ Footer
- ✅ BookingWidget (onglets Aéroport / Inter-ville)
- ✅ BookingForm (formulaire complet)
- ✅ LanguageSwitcher (dropdown)
- ✅ WhatsAppButton (flottant)
- ✅ Logo (optimisé next/image)

### Traductions
- ✅ Hébreu (`he.json`)
- ✅ Anglais (`en.json`)
- ✅ Français (`fr.json`)
- ✅ Russe (`ru.json`)
- ✅ Espagnol (`es.json`)

### Backend
- ✅ API route `POST /api/bookings` (créer réservation)
- ✅ API route `GET /api/bookings` (lister réservations)
- ✅ API route `GET/PATCH /api/bookings/[id]`
- ✅ Client Supabase + types TypeScript
- ✅ Schéma SQL (`supabase-schema.sql`)
- ✅ **Connexion Supabase réelle** — projet `zfoqfpbozjlqollswdli`
- ⬜ Email de confirmation automatique (Resend ou EmailJS)

### SEO
- ✅ `generateMetadata()` sur 5 pages × 5 locales
- ✅ Balises hreflang (alternates.languages)
- ✅ Sitemap XML (`/sitemap.xml`) — 30 URLs
- ✅ `robots.txt` (`/robots.txt`)
- ✅ Images renommées pour le SEO
- ⬜ Open Graph images par locale
- ✅ Schema.org JSON-LD (LocalBusiness + TaxiService) — `app/[locale]/layout.tsx`

---

## Phase 2 — Complet

### Fonctionnel
- ✅ ~~Remplacer le numéro placeholder~~ — vrai numéro `+972-54-310-0044` partout
- ⬜ Centraliser les constantes (téléphone, WhatsApp, email) dans `lib/constants.ts`
- ⬜ Calculateur de prix avancé (par km, heure, type de véhicule)
- ⬜ Réservation aller-retour complète
- ⬜ Suivi de vol en temps réel (API FlightAware ou AviationStack)
- ⬜ SMS de confirmation (Vonage / Twilio)
- ⬜ Carte Google Maps sur les pages routes et contact

### Admin
- ✅ Authentification admin — cookie httpOnly `admin_session` + `ADMIN_SECRET` serveur
- ⬜ Notifications en temps réel (Supabase Realtime)
- ⬜ Export CSV des réservations
- ⬜ Statistiques dashboard (revenus, trajets, chauffeurs)

### Images
- ⬜ Remplacer les images Wikipedia des route cards par des images locales
- ⬜ Images Open Graph par langue (1200×630px)
- ⬜ Photos réelles des véhicules de la flotte

### Design
- ⬜ Page 404 personnalisée
- ⬜ Page de maintenance
- ⬜ Animations de transition entre pages

---

## Phase 2b — SEO Agence IA

### Panel `/admin/seo`
- ✅ Agent Writer (Maya Cohen) — idées articles + analyse contenu
- ✅ Agent Concurrent (Yossi Ben David) — analyse concurrentielle Serper
- ✅ Agent Mots-clés (Rachel Mizrahi) — recherche keywords multi-langues
- ✅ Agent Auditeur (Rafi Shapira) — audit SEO avec données GSC réelles
- ✅ Agent Orchestrateur (David Levi) — plan stratégique croisé 30 jours
- ✅ Chat animé entre agents (onglet défaut)
- ✅ Stockage rapports en Supabase (`seo_reports`)
- ⬜ Onglet Articles — génération et publication d'articles de blog
- ⬜ Planification cron hebdomadaire automatique des agents
- ⬜ Historique et comparaison de rapports (évolution dans le temps)

---

## Phase 3 — Avancé

- 🔮 Paiement en ligne (Payplus / iCredit — solutions israéliennes)
- 🔮 Espace chauffeur (app web mobile — connexion, trajets du jour)
- 🔮 Application mobile (React Native)
- 🔮 Suivi GPS en temps réel du chauffeur
- 🔮 Programme de fidélité client
- ✅ Google Business Profile — créé, vérifié, 2 propriétaires (samcomm.d@gmail.com + support@moveotaxi.com), vidéo soumise

---

## Blocages actuels

| Blocage | Impact | Solution |
|---------|--------|----------|
| ~~`.env.local` vide~~ | ✅ Résolu — Supabase connecté | — |
| Numéro de téléphone placeholder | Affiche `+972-53-1234567` partout | Remplacer par le vrai numéro dans `lib/constants.ts` |
| ~~Pas de déploiement Vercel~~ | ✅ Résolu — moveo-taxi.vercel.app | — |
