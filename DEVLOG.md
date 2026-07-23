# Dev Log — Moveo Taxi

Journal chronologique des décisions techniques et changements importants.

---

## 2026-07-07

### SEO — 5 points implémentés (demande Gemini)
- Ajout du namespace `meta` (titre + description) dans les 5 fichiers `messages/*.json`
- `generateMetadata()` avec hreflang dans `app/[locale]/layout.tsx` et les 5 pages clés
- `localePrefix: "always"` explicite dans `proxy.ts`
- Création de `app/sitemap.ts` (30 URLs : 6 pages × 5 locales)
- Création de `app/robots.ts` (exclusion `/admin` et `/api/`)
- Audit Tailwind : aucune classe directionnelle non-logique trouvée

### Bug critique résolu — page blanche / erreur 500
**Cause** : Dans cette version de Next.js (16.2.9), le fichier de routing s'appelle `proxy.ts`, pas `middleware.ts`. La session précédente avait renommé `proxy.ts` → `middleware.ts` en croyant suivre la convention standard. Cette version affiche un avertissement explicite : *"The 'middleware' file convention is deprecated. Please use 'proxy' instead."*
**Fix** : Renommage `middleware.ts` → `proxy.ts` + vidage du cache `.next`
**Leçon** : Toujours lire `node_modules/next/dist/docs/` avant de modifier la configuration (voir `AGENTS.md`).

---

## 2026-07-07 (suite)

### Déploiement Vercel — site en production
- URL live : **https://moveo-taxi.vercel.app**
- Variables d'environnement Supabase ajoutées dans Vercel (Production + Preview + Development)
- Premier déploiement réussi depuis le repo GitHub `Samdev3615/moveo-taxi`

### Supabase connecté
- Projet créé : `moveo-taxi` (org Moveo Taxi, région Asia-Pacific/Tokyo)
- Project ID : `zfoqfpbozjlqollswdli`
- Table `bookings` créée + RLS activé + policies configurées
- Premier test de réservation réussi — ID `83609c34-39f1-4c4e-bcfa-cb8ae0c6cc50`
- `.env.local` rempli avec les vraies clés

### Numéro de téléphone réel
- Remplacé `+972-53-1234567` → `+972-54-310-0044` dans 8 fichiers
- WhatsApp : `972543100044`

---

## 2026-07-21 — Audit complet + corrections

### Sécurité — refonte authentification admin
**Problème** : Le mot de passe admin était stocké dans `NEXT_PUBLIC_ADMIN_PASSWORD` (exposé au navigateur) et vérifié côté client uniquement.
**Solution** : Authentification entièrement déplacée côté serveur.
- `lib/admin-auth.ts` : helper `isAdminAuthenticated()` — lit le cookie httpOnly `admin_session` et compare à `ADMIN_SECRET` (env var serveur uniquement)
- `app/api/admin/login/route.ts` : POST vérifie le mot de passe, pose un cookie httpOnly 7 jours
- `app/api/admin/logout/route.ts` : POST efface le cookie
- `app/api/admin/prices/route.ts` + `[id]/route.ts` : GET/POST/PATCH/DELETE protégés par `isAdminAuthenticated()`
- `components/AdminAuthLayout.tsx` : login/logout appellent les API routes (plus de comparaison côté client)
- `components/AdminPrices.tsx` : mutations prix via `/api/admin/prices/*` (plus d'accès direct Supabase anon)
- `app/api/bookings/route.ts` + `[id]/route.ts` : GET/PATCH/DELETE protégés
- Vercel : `ADMIN_SECRET` ajouté, `NEXT_PUBLIC_ADMIN_PASSWORD` supprimé, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` renommé en `GOOGLE_MAPS_API_KEY`
- Supabase : policy RLS "Service write" supprimée (`supabase/fix-rls-route-prices.sql`)

### SEO — corrections complètes
- Canonical URLs ajoutés sur toutes les pages publiques (home, airport, about, contact, routes, drivers)
- hreflang `alternates.languages` ajouté sur `/route/[slug]` (he/en/fr/ru/es + x-default)
- `app/sitemap.ts` : `/drivers` ajouté (priority 0.7, changeFrequency monthly)
- `app/[locale]/confirmation/[id]/page.tsx` : `robots: "noindex, nofollow"` + vérification UUID en base avant affichage (notFound() si inconnu)

### Fix images route cards — .gitignore
**Cause** : Les règles `*.jpg` et `*.jpeg` dans `.gitignore` bloquaient les 4 images de routes (`route-jerusalem.jpg`, etc.).
**Fix** : Suppression de ces règles, force-add des images, commit. Images maintenant déployées sur Vercel.

### Performance & code
- `app/[locale]/page.tsx` : `export const revalidate = 3600` (ISR — page régénérée toutes les heures)
- `lib/hooks/usePriceData.ts` : hook extrait (logique fetch prix partagée entre BookingWidget et BookingForm, élimine la duplication)
- `components/BookingForm.tsx` : fix onglets (2 intercité / 3 aéroport), validation regex téléphone, prix nuit — suppression fallback 10h (prix affiché uniquement si heure sélectionnée)
- `app/[locale]/page.tsx` : `TFunc` dérivé de `Awaited<ReturnType<typeof getTranslations>>` (plus de type artisanal)

### Admin UX
- `components/AdminDashboard.tsx` : `LANG_FLAGS` dédupliqué, `fetchError` state + bannière rouge + bouton retry si API échoue, vérification `res.ok` sur `updateStatus`
- `components/AdminPrices.tsx` : états de chargement `adding` + `deletingId` — spinner Loader2 sur boutons Ajouter et Supprimer pendant la requête

### i18n — traductions
- `lib/email.ts` : `cityNames` étendu de 10 à 30 villes dans les 5 langues
- `messages/*.json` : ajout clés `booking.price.quote` et `meta.drivers.{title,description}` (via scripts Node.js pour éviter le BOM PowerShell)

### Fix build Vercel
6 fichiers existant localement mais jamais commités causaient un crash build (`module-not-found`) :
- `components/AdminBookingModal.tsx`
- `components/AdminCalendar.tsx`
- `app/admin/calendar/page.tsx`
- `public/admin-manifest.json`
- `app/admin/layout.tsx` (modifications)
- `lib/supabase-server.ts` (modifications)

### UI fixes
- Section garanties (`bg-gray-950`) : sous-titres `text-gray-600` → `text-gray-400` (contraste insuffisant sur fond noir)
- `LanguageSwitcher.tsx` : emoji drapeaux → images PNG locales `public/images/flags/{code}.png` (les emoji drapeaux ne s'affichent pas sur Windows)

### Google Search Console
- Sitemap `sitemap.xml` renvoyé (Google détecte maintenant `/drivers`)
- `/he/drivers` : indexation demandée manuellement
- `/confirmation/*` vérifié : "Google ne reconnaît pas cette URL" — noindex effectif

---

## 2026-07-17 → 2026-07-21

### Règle capacité bagages — modal d'alerte
Règle : 1 valise = 2 unités trolley, coffre sedan = 8 unités max. Si dépassé avec ≤ 4 passagers, modal d'avertissement s'affiche.
- Bouton "Accepter — Taxi 6 places" : force `luggageForced = true`, prix recalculé en minibus
- Bouton "Corriger mes bagages" : revert précis sur le champ incrémenté (snapshot `preWarningLuggage`)
- État auto-reset : si bagages repassent ≤ 8 unités, `luggageForced` repasse à `false`
- Traductions dans les 5 fichiers `messages/*.json` : `luggage_warning_title`, `luggage_warning_body`, `luggage_warning_accept`, `luggage_warning_correct`
- Return du composant wrappé dans `<>` (fragment) pour avoir le modal comme sibling de la div principale

### Fix widget → formulaire : données non transmises
**Cause** : `BookingWidget.tsx` n'incluait pas le paramètre `direction` dans l'URL de navigation.  
**Conséquence** : Les champs from/to affichaient `--` sur le formulaire même si sélectionnés sur la homepage.  
**Fix** : Calcul `isAirport` + `direction` dans `handleSubmit`, ajouté aux `URLSearchParams`.

### Admin — affichage bagages et infos structurées
- Renommage `parseLuggage` → `parseNotes` dans `AdminDashboard.tsx` (retourne désormais `suitcases`, `trolleys`, `address`, `source`, `lang`, `driverIsMe`, `driverName`, `driverPhone`)
- Affichage dans colonne Trajet : icône valise + compteurs, adresse de prise en charge, badge chauffeur ("Moi" ou nom + téléphone)
- Affichage dans colonne Client : badge source coloré + drapeau langue

### Admin Agenda (calendrier mensuel)
Nouveau composant `components/AdminCalendar.tsx` + page `app/admin/calendar/page.tsx`.
- Grille mensuelle 7 colonnes (Lun→Dim), cellules 88px
- Chaque cellule : numéro jour (cercle bleu = aujourd'hui), nb réservations, revenus, points de statut (amber/vert/bleu)
- Navigation mois précédent/suivant + bouton "Aujourd'hui"
- Barre stats : total réservations, revenus estimés, jours actifs
- Panneau latéral (300px) : détail du jour sélectionné, cards triées par heure
- Chaque card : heure, trajet, client (téléphone cliquable), passagers/véhicule/bagages, chauffeur, statut + boutons action
- Lien "Agenda" ajouté dans sidebar `AdminAuthLayout.tsx`

### Saisie manuelle de réservation (admin)
Nouveau composant `components/AdminBookingModal.tsx` — drawer slide-over depuis la droite.
- Bouton "+ Nouvelle réservation" dans l'en-tête de `AdminDashboard`
- Champs : Client (nom, téléphone, email), Trajet (from/to avec auto-direction aéroport, date, heure, vol, terminal, adresse), Passagers & bagages, Source, Langue client, Chauffeur, Prix & statut, Notes
- **Source** : chips WhatsApp / Téléphone / Site web / Email / Recommandation / Autre (défaut : WhatsApp)
- **Langue client** : chips avec drapeaux 🇫🇷🇮🇱🇬🇧🇷🇺🇪🇸🇸🇦 (défaut : fr)
- **Chauffeur** : toggle "Je fais la course" / "Attribuer à un chauffeur" + champs nom+téléphone conditionnels
- Toutes ces données encodées comme lignes préfixées dans le champ `notes` DB : `Source: X`, `Langue: X`, `Chauffeur: X | tel`, `Adresse: X`, `Valises: N`, `Trolleys: N`

### Modification d'une réservation existante
- Bouton **"✏ Modifier"** (bleu, visible) sur chaque ligne du tableau dans la colonne Actions
- `AdminBookingModal` accepte prop `booking?: Booking` — mode édition si fourni
- `parseNotesForEdit()` : décode le champ `notes` pour repeupler les champs du formulaire (source, langue, chauffeur, adresse, valises, trolleys, notes libres)
- Titre dynamique : "Modifier la réservation" + ID court en sous-titre
- Submit envoie `PATCH /api/bookings/${id}` avec `_full_update: true` au lieu d'un POST
- `app/api/bookings/[id]/route.ts` : handler PATCH étendu pour mise à jour complète (tous les champs) quand `_full_update === true`

### Suppression de réservations annulées
- Bouton poubelle 🗑 sur les lignes avec statut "Annulé"
- Confirmation inline en 2 clics : 🗑 → "Confirmer | Non" (évite `confirm()` natif bloqué en production)
- `DELETE /api/bookings/[id]` : nouvel endpoint dans `app/api/bookings/[id]/route.ts`
- Utilise `supabaseAdmin` (service role key) pour bypasser les politiques RLS

### Fix BOM sur SUPABASE_SERVICE_ROLE_KEY
**Cause** : La clé avait été ajoutée dans Vercel avec un caractère BOM (U+FEFF, valeur 65279) en tête.  
**Symptôme** : `TypeError: Cannot convert argument to a ByteString because the character at index 0 has a value of 65279`  
**Fix** : `lib/supabase-server.ts` — `.replace(/^﻿/, "").trim()` sur la clé lors de la création du client.

### Admin responsive mobile
- `AdminAuthLayout.tsx` : sidebar cachée sur mobile, bouton ☰ hamburger en top bar, slide-over avec overlay backdrop
- `AdminDashboard.tsx` : stats en `grid-cols-2` sur mobile, cards empilées au lieu du tableau, tous les boutons d'action tappables
- `AdminCalendar.tsx` : layout `flex-col` sur mobile (calendrier puis panneau détail en dessous), cellules réduites à 60px sur mobile

### PWA — icône sur smartphone Android
- `public/admin-manifest.json` : manifeste PWA avec `start_url: "/admin/bookings"`, `display: "standalone"`, `theme_color: "#0f2445"`, icône logo existante
- `app/admin/layout.tsx` : `metadata.manifest = "/admin-manifest.json"`
- Procédure : Chrome → moveotaxi.com/admin → ⋮ → "Ajouter à l'écran d'accueil"

---

## 2026-07-14 → 2026-07-17

### Suppression des emojis — remplacement par lucide-react
Tous les emojis dans les composants UI ont été remplacés par des icônes `lucide-react` (taille fixe, cohérence thème clair/sombre, pas de rendu variable selon l'OS).

### Autocomplétion Google Places — refonte complète
**Problème initial** : La bibliothèque Google Maps JS (`Autocomplete`) manipule le DOM directement, ce qui conflicte avec le cycle de rendu React → input se bloque après 2 caractères.  
**Solution** : Pattern proxy serveur — aucune bibliothèque client Google Maps.
- Nouveau fichier `app/api/places/route.ts` : proxy qui appelle `POST https://places.googleapis.com/v1/places:autocomplete` (Places API **New**, pas l'ancienne) côté serveur
- `components/AddressAutocomplete.tsx` : composant React pur avec `fetch` vers `/api/places`, dropdown custom, debounce 300 ms
- Variable d'env : `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (projet Google Cloud `iron-envelope-502418`)

**Piège Vercel** : `echo "key" | vercel env add` ajoute un `\n` à la fin de la clé → API 500 en production. Fix : utiliser `printf 'key' | vercel env add` (sans retour à la ligne).  
**Activation requise** : "Places API (New)" dans Google Cloud Console → Bibliothèque. L'ancienne "Places API" est désactivée pour ce projet.

### Bug booking — véhicule toujours "6 places" en admin
**Cause** : `AdminDashboard.tsx` comparait `b.vehicle_type === "car4"` mais la DB stocke `"sedan"`. Condition toujours fausse → toujours "6 places".  
**Fix** : Comparaison changée en `b.vehicle_type === "sedan"` → `"minibus"`.  
**Fix secondaire** : `lib/supabase.ts` — type TypeScript `VehicleType` corrigé : `"car4" | "car6"` → `"sedan" | "minibus"` (pour correspondre aux valeurs réelles en DB).

### Formulaire de réservation — améliorations UX

#### Libellés des onglets d'étapes
- Étape 1 : `t("tabs.airport")` ou `t("tabs.intercity")` selon le type de trajet
- Étape 2 : `t("tabs.flight")` (était tronqué "Vol")
- Étape 3 : `t("tabs.contact")` (était tronqué "Nom co")
- Clés ajoutées dans les 5 fichiers `messages/*.json`

#### Boutons Continuer / Retour (5 langues)
Remplacement des flèches `→` / `←` par du texte localisé (`t("form.continue")` / `t("form.back")`). Traductions ajoutées pour `he`, `fr`, `en`, `ru`, `es`.

#### Validation par étape avec messages d'erreur
Avant d'avancer à l'étape suivante, le bouton "Continuer" vérifie chaque champ obligatoire et affiche un message explicite sous le formulaire (`setValidationError`). Messages traduits dans les 5 langues.
- Étape 1 : `from_city`, `to_city`, `date`, `time`
- Étape 3 : `name`, `phone`

#### Champs bagages (valises + trolleys)
Ajout de deux compteurs `+/-` dans le formulaire (step 2) :
- `suitcases` (valises) et `trolleys` (trolleys), plage 0–9
- Données incluses dans les notes de réservation en DB : `Valises: N`, `Trolleys: N`
- Interface en grille 2 colonnes, icônes lucide-react

### Calendrier — popup coupé
**Cause** : Deux `overflow-hidden` empilés — un dans `BookingWidget.tsx` (conteneur principal) et un dans `app/[locale]/page.tsx` (wrapper du widget).  
**Fix** : Suppression de `overflow-hidden` dans les deux endroits. La bordure arrondie du widget est préservée via `rounded-[24px]` seul.

### Suppression de l'onglet "Aller-retour"
L'onglet aller-retour était un vestige non fonctionnel. Supprimé de `BookingWidget.tsx` : type `TripMode`, état `mode`, bloc de rendu des onglets, import `ArrowLeftRight`. Remplacé par `<ArrowRight size={14} className="rotate-90" />` pour le swap de villes.

### Panel admin — améliorations
- Lien "Voir le site" ajouté dans la sidebar (`AdminAuthLayout.tsx`) avec icône `ExternalLink` (lucide-react), ouvre `/` dans un nouvel onglet
- Affichage corrigé du type de véhicule (voir section bug ci-dessus)

### Commit de référence
`67b5a85` — push sur `master` le 2026-07-17

---

## Sessions précédentes

### Hero — refonte Uber/Bolt style
**Problème** : L'image hero apparaissait "collée" sur la page, look amateur.
**Solution** : Image en fond plein (`fill` + `object-cover`) avec overlay dégradé sombre (`from-black/75 via-black/40 to-black/10`) côté texte. Widget carte blanche qui ressort sur le fond sombre. Même approche qu'Uber, Bolt, Cabify.
**Fichier** : `app/[locale]/page.tsx`

### Système de couleurs
Couleurs finales adoptées :
- Vert `#16A34A` / `#15803D` — confiance, action
- Orange `#F97316` / `#EA580C` — mobilité, énergie
Appliqué dans `globals.css`, `BookingWidget.tsx`, `Navbar.tsx`, `Footer.tsx`, `LanguageSwitcher.tsx`.

### Police Heebo unifiée
Remplacement de la combinaison Heebo + Inter par **Heebo seul** (weights 300–900). Heebo supporte l'hébreu et le latin, ce qui évite le chargement de deux polices.

### GitHub — repo public
Repo rendu public (`gh repo edit --visibility public --accept-visibility-change-consequences`) pour permettre l'accès au collaborateur Hermes.

### Logo
- Dossier créé : `public/images/`
- Logo placé et renommé `moveo-taxi-logo.png` (nom SEO-friendly)
- Composant `Logo.tsx` créé avec variants de taille

### i18n — architecture URL
Chaque langue a sa propre URL (`/he`, `/fr`, `/en`, `/ru`, `/es`). Google indexe chaque langue séparément — pas une seule page avec JS. next-intl gère le routing via `proxy.ts`.

---

## 2026-07-23 — Panel SEO Agence + Google Business Profile

### Panel admin SEO avec agents IA (`/admin/seo`)
Nouveau module complet d'analyse SEO piloté par des agents Claude Sonnet 5.

**5 agents créés** (`app/api/agents/*/route.ts`) :
- **writer** (`Maya Cohen`) — Analyse contenu + idées d'articles SEO via Serper
- **competitor** (`Yossi Ben David`) — Analyse concurrentielle Google (Ben Gurion taxi market)
- **keywords** (`Rachel Mizrahi`) — Recherche mots-clés stratégiques multi-langues
- **auditor** (`Rafi Shapira`) — Audit SEO complet avec données Google Search Console réelles
- **orchestrator** (`David Levi`) — Lit les 4 rapports et produit un plan stratégique croisé

**Architecture agents :**
- Chaque agent : route GET protégée par `CRON_SECRET`
- Déclenchement via `POST /api/admin/trigger-agent?agent=X` (protégé admin, uses `after()` pour tâche de fond)
- Rapports stockés en table Supabase `seo_reports` (colonnes : `agent`, `title`, `summary`, `content` JSONB, `created_at`)
- `maxDuration = 300` sur l'orchestrateur (Claude avec 16 000 tokens max)

**Page admin SEO** (`app/admin/seo/page.tsx`) :
- 3 onglets : **Chat** (défaut) | **Rapports** | **Articles**
- Onglet Chat : conversation animée entre agents (messages progressifs avec indicateur de frappe 3 points)
  - David (orchestrateur) à droite (style iMessage), autres agents à gauche
  - Bouton "Rejouer" pour relancer l'animation
  - Basé sur les vrais rapports Supabase (`buildConversation()`)
- Onglet Rapports : liste avec avatar circulaire de l'agent + badge count réel
- Boutons "Lancer" individuels par agent, indigo pour l'orchestrateur
- Grille `sm:grid-cols-5` pour les 5 agents

**Images équipe :**
- `public/images/team-maya.png`, `team-yossi.png`, `team-rachel.png`, `team-rafi.png` (remplacé), `team-david.png` (nouveau)

**Bug fixes :**
- `VALID_AGENTS` dans `trigger-agent/route.ts` n'incluait pas `"orchestrator"` → ajouté
- Filtre JSONB Supabase `.not("content->error", "is", "true")` instable → remplacé par filtre JS côté app (`data.find(r => !r.content?.error)`)

**Variables d'env requises :**
- `ANTHROPIC_API_KEY` — Claude Sonnet 5
- `SERPER_API_KEY` — Recherches Google réelles
- `GSC_REFRESH_TOKEN` — Google Search Console (OAuth2, déjà configuré)
- `CRON_SECRET` — Protection des routes agents

### Google Business Profile — mise à jour
- **Vérifié existant** sous samcomm.d@gmail.com (créé lors d'une session précédente)
- **support@moveotaxi.com ajouté comme propriétaire** (invitation acceptée)
- **Vidéo de vérification envoyée** à Google (façade + intérieur + site moveotaxi.com) — réponse attendue sous 3-5 jours
- Décision : garder les **deux comptes propriétaires** (samcomm.d@gmail.com = backup)

### Schema.org JSON-LD
Confirmé déjà implémenté dans `app/[locale]/layout.tsx` — `LocalBusiness` + `TaxiService`.

---

## Décisions d'architecture

| Décision | Raison |
|----------|--------|
| `proxy.ts` au lieu de `middleware.ts` | Convention de cette version Next.js 16.x |
| `localePrefix: "always"` | Toutes les locales ont un préfixe URL, y compris la langue par défaut `he`. Cohérence SEO. |
| Hébreu comme langue par défaut | Marché cible principal = Israël |
| Heebo comme seule police | Supporte hébreu + latin, évite le chargement de 2 polices |
| Tailwind classes logiques uniquement | Support RTL natif sans duplication de CSS |
| Supabase + API routes Next.js | Backend simple, scalable, panel admin intégré |
| Images héro en fond plein (pas colonne) | Approche pro (Uber/Bolt), évite l'effet "image collée" |
