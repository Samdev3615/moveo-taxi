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
