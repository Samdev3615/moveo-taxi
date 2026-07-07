# Moveo Taxi 🚖

Site de réservation de taxi en Israël — transferts aéroport Ben Gourion et trajets inter-villes.

## Stack technique

- **Next.js 14** (App Router)
- **next-intl** — 5 langues : hébreu (RTL), anglais, français, russe, espagnol
- **Tailwind CSS v4**
- **Supabase** — base de données et panel admin
- **Vercel** — déploiement

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Variables d'environnement

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil avec widget de réservation |
| `/airport` | Transferts aéroport Ben Gourion |
| `/booking` | Formulaire de réservation |
| `/routes` | Trajets inter-villes et tarifs |
| `/about` | À propos de Moveo Taxi |
| `/contact` | Contact et horaires |
| `/admin` | Panel admin (protégé) |

## Langues

Le site est disponible en 5 langues via les routes `/he`, `/en`, `/fr`, `/ru`, `/es`.
L'hébreu est la langue par défaut avec support RTL complet.
