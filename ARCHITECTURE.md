# Architecture — Moveo Taxi

## Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js (App Router, Turbopack) | 16.2.9 |
| Internationalisation | next-intl | 4.13.x |
| Styles | Tailwind CSS | v4 |
| Base de données | Supabase (PostgreSQL) | — |
| Déploiement | Vercel (prévu) | — |
| Langue principale | TypeScript | — |

---

## Conventions critiques (spécifiques à cette version)

> **IMPORTANT** — Cette version de Next.js diffère des versions courantes.

- Le fichier de routing middleware s'appelle **`proxy.ts`** (pas `middleware.ts` qui est déprécié dans cette version)
- Lire `node_modules/next/dist/docs/` avant de toucher à la configuration Next.js

---

## Structure des dossiers

```
moveo-taxi/
├── app/
│   ├── [locale]/               # Toutes les pages i18n
│   │   ├── layout.tsx          # Layout racine : <html lang dir>, fonts, generateMetadata
│   │   ├── page.tsx            # Page d'accueil + Hero + BookingWidget
│   │   ├── airport/page.tsx    # Transferts aéroport Ben Gourion
│   │   ├── booking/page.tsx    # Formulaire de réservation complet
│   │   ├── routes/page.tsx     # Trajets inter-villes + tarifs
│   │   ├── about/page.tsx      # À propos
│   │   ├── contact/page.tsx    # Contact + WhatsApp
│   │   ├── drivers/page.tsx    # Page recrutement chauffeurs
│   │   ├── login/page.tsx      # Login (admin + chauffeurs)
│   │   ├── confirmation/[id]/  # Confirmation post-réservation
│   │   ├── privacy/page.tsx    # Politique de confidentialité
│   │   └── terms/page.tsx      # CGU
│   ├── admin/                  # Panel admin (hors i18n, accès direct)
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard réservations
│   │   └── bookings/page.tsx
│   ├── api/
│   │   └── bookings/
│   │       ├── route.ts        # POST (créer) + GET (lister)
│   │       └── [id]/route.ts   # GET/PATCH/DELETE par ID
│   ├── layout.tsx              # Root layout minimal (retourne children)
│   ├── page.tsx                # Redirection racine → /he
│   ├── globals.css             # Variables CSS + font Heebo
│   ├── sitemap.ts              # Sitemap XML automatique (30 URLs)
│   └── robots.ts               # robots.txt automatique
│
├── components/
│   ├── Navbar.tsx              # Navigation sticky + menu mobile RTL-aware
│   ├── Footer.tsx              # Footer avec liens et contacts
│   ├── BookingWidget.tsx       # Widget de réservation (onglets Aéroport/Inter-ville)
│   ├── BookingForm.tsx         # Formulaire complet multi-étapes
│   ├── AdminDashboard.tsx      # Composant dashboard admin
│   ├── LanguageSwitcher.tsx    # Sélecteur de langue (dropdown)
│   ├── Logo.tsx                # Logo Moveo Taxi (next/image)
│   └── WhatsAppButton.tsx      # Bouton flottant WhatsApp
│
├── i18n/
│   ├── config.ts               # locales, defaultLocale, rtlLocales
│   └── request.ts              # Configuration next-intl par requête
│
├── lib/
│   ├── supabase.ts             # Client Supabase + types Booking
│   ├── prices.ts               # Calcul des tarifs par trajet
│   └── utils.ts                # Utilitaires divers
│
├── messages/                   # Traductions JSON (une clé = une langue)
│   ├── he.json                 # Hébreu (langue par défaut)
│   ├── en.json
│   ├── fr.json
│   ├── ru.json
│   └── es.json
│
├── public/
│   └── images/
│       ├── hero-taxi-transfert-aeroport-israel.png
│       └── moveo-taxi-logo.png
│
├── proxy.ts                    # Routing i18n (équivalent middleware Next.js standard)
├── next.config.ts
├── supabase-schema.sql         # Schéma SQL de la table bookings
└── .env.local                  # Clés Supabase (non committé)
```

---

## Internationalisation (i18n)

### Locales
| Code | Langue | Sens | URL |
|------|--------|------|-----|
| `he` | Hébreu | RTL (droite → gauche) | `/he` |
| `en` | Anglais | LTR | `/en` |
| `fr` | Français | LTR | `/fr` |
| `ru` | Russe | LTR | `/ru` |
| `es` | Espagnol | LTR | `/es` |

- Langue par défaut : `he`
- `localePrefix: "always"` → toutes les URLs ont leur préfixe, y compris `/he`
- `dir="rtl"` automatique sur `<html>` pour l'hébreu

### RTL — règles Tailwind
Utiliser exclusivement les **classes logiques** Tailwind :

| ❌ Ne pas utiliser | ✅ Utiliser à la place |
|-------------------|----------------------|
| `pl-4`, `pr-4` | `ps-4`, `pe-4` |
| `ml-4`, `mr-4` | `ms-4`, `me-4` |
| `left-0`, `right-0` | `start-0`, `end-0` |
| `text-left`, `text-right` | `text-start`, `text-end` |
| `rounded-l-`, `rounded-r-` | `rounded-s-`, `rounded-e-` |

CSS Grid inverse automatiquement les colonnes en RTL.

---

## Design system

### Couleurs
```css
--primary:       #16A34A  /* Vert — confiance, action */
--primary-dark:  #15803D
--primary-light: #f0fdf4
--accent:        #F97316  /* Orange — énergie, mobilité */
--accent-dark:   #EA580C
--accent-light:  #fff7ed
```

### Typographie
- Police unique : **Heebo** (Google Fonts, weights 300–900)
- Fonctionne pour l'hébreu et les langues LTR
- Chargée via `<link>` dans `app/[locale]/layout.tsx`

---

## Flux de données — Réservation

```
Utilisateur
    ↓
BookingWidget (composant client)
    ↓ formulaire soumis
POST /api/bookings
    ↓
Supabase — table bookings (status: "pending")
    ↓
Redirect → /[locale]/confirmation/[id]
    ↓
Admin notifié → panel /admin ou WhatsApp
```

---

## SEO

- `generateMetadata()` dans chaque page — titre + description par locale
- `alternates.languages` (hreflang) dans le layout → tous les 5 locales + `x-default: /he`
- Sitemap XML auto : `/sitemap.xml` — 30 URLs (6 pages × 5 locales)
- `robots.txt` auto : `/robots.txt` — `/admin` et `/api/` exclus du crawl
- Namespace `meta` dans chaque fichier `messages/*.json`

---

## Variables d'environnement

```env
# .env.local (non committé)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
