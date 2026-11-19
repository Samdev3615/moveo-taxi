# Devlog — Moveo Taxi

---

## Session du 2026-08-03

### MCP GA4 opérationnel
- Création de `scripts/ga4-auth.js` et `scripts/ga4-mcp-server.js`
- Authentification OAuth2 réussie — propriété GA4 "Moveo Taxi" (ID: 546389290) détectée automatiquement
- Token sauvegardé dans `.ga4-token.json`
- MCP `ga4-moveo` enregistré dans `.claude.json` (aux côtés de `gsc-moveo`)
- 5 outils disponibles : `ga4_traffic_overview`, `ga4_top_pages`, `ga4_traffic_sources`, `ga4_by_country`, `ga4_by_language`

### Agents SEO branchés sur données réelles
- Création de `lib/ga4.ts` (équivalent de `lib/gsc.ts` pour Google Analytics 4)
- `GA4_REFRESH_TOKEN` et `GA4_PROPERTY_ID` ajoutés dans `.env.local`
- `app/api/agents/auditor/route.ts` — ajout GA4 (sessions, pages, sources, pays)
- `app/api/agents/orchestrator/route.ts` — ajout GSC live + GA4 live en contexte direct
- Les agents travaillent maintenant sur de vraies données, pas uniquement Serper

### Stratégie SEO clarifiée
Routes prioritaires validées (ordre SEO + Google Ads) :
1. Jérusalem ↔ Ben Gourion
2. Tel Aviv ↔ Ben Gourion
3. Netanya ↔ Ben Gourion
4. Ashdod ↔ Ben Gourion
5. Tout le reste

Véhicule phare : **sedan 4 places, capacité 4 grandes valises**.

### Rapport Orchestrateur (lancé depuis /admin/seo)
- Score SEO : 25/100 → potentiel 70/100
- 7 réservations en 30 jours, 100% aéroport, 0% intercité
- Angle mort : Netanya = 57% des réservations mais aucun contenu SEO dédié
- Quick win : /es non indexée alors que marché espagnol est le moins saturé

---

## Comparaison trafic 30 juil. → 3 août (4 jours)

| Métrique | 30 juil. | 3 août | Δ |
|----------|----------|--------|---|
| Sessions | 79 | 98 | +24% |
| Utilisateurs | 54 | 67 | +24% |
| Pages vues | 158 | 216 | +37% |
| Taux de rebond | 63% | 55% | -8 pts |
| Durée moyenne | 2m14s | 2m56s | +42s |

**Sources :**
- Direct : 51 → 61
- Google organique : 16 → 20
- AI Assistant (ChatGPT/Perplexity) : 10 → 17 (+70%)

**Nouvelles requêtes GSC (absentes le 30 juil.) :**
- "moveo taxi" — pos. 3.75 — 3 clics (marque cherchée directement)
- "taxi jerusalem to ben gurion airport price" — pos. 82
- "taxi tel aviv to ben gurion airport" — pos. 78
- "taxi netanya" / "netanya taxi" — pos. 61–72
- "такси нагария" (Nahariya RU) — pos. 11.75

**Engagement :**
- /fr : rebond 36% → 16%
- /fr/booking : rebond 40% → 11%

---

---

## Session du 2026-08-04

### Analyse SEO — comparaison 2 → 4 août

**Trafic GA4 (Δ 2 jours) :**

| Métrique | 2 août | 4 août | Δ |
|----------|--------|--------|---|
| Sessions | 96 | 103 | +7 (+7.3%) |
| Utilisateurs | 66 | 70 | +4 (+6.1%) |
| Pages vues | 209 | 225 | +16 (+7.7%) |
| Taux de rebond | 54.2% | 57.3% | +3.1 pts ⚠️ |
| Durée moy. | 2m47s | 2m50s | stable |

Rythme ~8 sessions/jour. Trafic IA (ChatGPT/Perplexity) = 17 sessions = 16.5% du total.

**Signaux GSC nouveaux :**
- "cheap airport shuttle vs taxi Israel" — pos **9** (nouveau signal, requête comparaison)
- "taxi autour de moi pas cher" (FR) — pos **6** (inattendu, signal audience française locale)
- /fr/routes : 18 impressions GSC, CTR 5.6% seulement → title/meta à réécrire
- /ru/route/tel-aviv-jerusalem : CTR 100% (1 clic / 1 impression, pos 5) — page russe qui convertit

**3 actions prioritaires identifiées :**
1. Réécrire title/meta /fr/routes (18 impressions perdues)
2. Créer article blog "shuttle vs taxi Israël" (pos 9, audience décisionnelle)
3. Surveiller rebond global semaine du 11 août (hausse de 3.1 pts à confirmer)

---

---

## Session du 2026-08-09

### Audit SEO complet (GA4 + GSC + code review)

Score initial : **38/100** ("En développement") — potentiel estimé 80/100.

Données clés GA4 (30 jours au 09/08) :
- ~100 sessions/jour, bounce 55-57%, durée moy. ~2m50s
- Trafic IA (ChatGPT/Perplexity) ≈ 16% du total — signal positif

Données GSC :
- 75 requêtes indexées, position moy. desktop **43.9**, mobile **51.8**
- Marché espagnol : **0 présence** (langue configurée mais aucun signal de classement)
- 6 actions prioritaires identifiées et exécutées dans la session

### Corrections exécutées

**Fix critique — robots.txt (commit dans 8c5c033)**
- `sitemap: "https://www.moveotaxi.co.il/sitemap.xml"` → `"https://www.moveotaxi.com/sitemap.xml"`
- Domaine `.co.il` inexistant = Google ne pouvait pas lire le sitemap via robots.txt

**Nouveau système route-content.ts**
- `lib/route-content.ts` — enrichissement optionnel par route + locale
- 7 routes configurées, 10 variantes locale : `jerusalem-ben-gurion` (EN+HE), `tel-aviv-jerusalem` (HE+FR), `jerusalem-eilat` (HE), `beer-sheva-ben-gurion` (RU+EN), `nahariya-ben-gurion` (RU), `netanya-ben-gurion` (EN), `tel-aviv-haifa` (RU)
- Chaque entrée apporte : section "About this route" en page, FAQs supplémentaires (JSON-LD FAQPage enrichi), meta description améliorée avec keywords spécifiques
- Routes sans contenu : zéro régression, template générique inchangé

**Sitemap async + articles blog (commit 1c84ab7)**
- `app/sitemap.ts` converti de sync → `async`
- Query Supabase pour tous les `blog_posts` avec `status='published'`
- URL reconstruite en strippant le suffixe locale du slug : `"article-slug-en"` → `/en/blog/article-slug`
- Articles ajoutés à priority 0.7, changeFrequency "monthly"

**Homepage EN/RU — titres spécifiques + price pills (commit bc0c82d)**
- `messages/en.json` hero : `"Private Taxi to" / "Ben Gurion Airport" / "Tel Aviv · Jerusalem · Netanya · Ashdod"`
- `messages/ru.json` hero : `"Трансфер в" / "Аэропорт Бен-Гурион" / "Тель-Авив · Иерусалим · Нетания · Ашдод"`
- `app/[locale]/page.tsx` : price pills (₪155 / ₪270 / ₪230) + WhatsApp CTA data-driven pour EN et RU — même UX que HE

**Fix writer agent (commit 47ff33a)**
- `max_tokens: 2000` → `max_tokens: 4096` dans `app/api/agents/writer/route.ts`
- Root cause du bug "null value in column content" : le modèle tronquait la réponse JSON avant d'écrire le champ `content`, qui arrivait `undefined` → constraint violation Supabase
- Fix secondaire (f818c08) : extraction du vrai message d'erreur PostgrestError pour logs lisibles

**Onglet Analyse SEO dans /admin/seo (commits 502f92d + 3900e41)**
- Nouveaux graphiques GA4 + GSC directement dans le panel admin
- Sessions, top pages, sources, positions moyennes

### Commits de la session
| Hash | Description |
|------|-------------|
| 47ff33a | fix: augmenter max_tokens writer 2000→4096 |
| f818c08 | fix: extraire le vrai message d'erreur Supabase dans le writer |
| 502f92d | feat: ajout onglet Analyse dans la page admin SEO |
| 3900e41 | feat: onglet Analyse SEO dans l'admin avec graphiques GA4 + GSC |
| 8c5c033 | feat: GA4 MCP + amélioration page hébraïque mobile |
| bc0c82d | feat: EN/RU homepage improvements (titre spécifique + price pills) |
| 730bfaf | feat: lib/route-content.ts — rich route content system (ranks 2–3) |
| 87513e0 | feat: route-content.ts — 5 routes supplémentaires (rank 6) |
| 1c84ab7 | feat: sitemap async + blog posts Supabase |

### Non résolu (continu)
- Backlinks : ne peut pas être fait par code — approche éditoriale/partenariats
- Marché espagnol `/es` : 0 présence GSC, travail de fond nécessaire
- Position moyenne 43.9 → objectif < 20 : travail de longue haleine (contenu + autorité)
- Blog : accumulation d'articles dans la durée via agent writer

---

---

## Session du 2026-08-17

### Audit SEO tri-périodes (03/08 → 09/08 → 17/08)
- Audit complet via GA4 MCP + GSC MCP — rapport publié en artifact
- Position mobile : **51.8 → 12.9** grâce aux ajouts route-content.ts de la session précédente
- Position desktop : 45.1 (stable)
- Score estimé : 38/100 → 55/100 (progression visible)

### Emails — améliorations

**Bouton WhatsApp dans notification admin**
- `lib/email.ts` — `whatsappTemplates` (5 locales, markdown WhatsApp `*bold*`, 👋)
- `buildWhatsAppLink()` : normalisation numéro (+972), dispatch locale, `encodeURIComponent`
- Bouton vert "📱 WhatsApp client" dans l'email admin (`display: inline-block` Gmail-compatible)
- Correction : première version utilisait `display: flex` (strippé par Gmail) → `inline-block`
- Correction : première version avec emojis 🚖📍 → affichés ◆ dans WhatsApp → redesign avec `*bold*`

**Prix fixe (retire "Estimé")**
- Suppression de "Estimated" / "Prix estimé" / "Примерная цена" / "מחיר משוער" / "Precio estimado"
- Remplacé par : "Price" / "Prix" / "Цена" / "מחיר" / "Precio" dans templates email + WhatsApp

**Fix date wrapping en email**
- `<td style="white-space: nowrap;">` sur la cellule date/heure
- Corrigeait l'affichage "2026-09-1 / 5 — 14:00" dans les clients email étroits

### Gestion réservations Chiedza Tinaani
- 4 réservations trouvées pour chiedza05@icloud.com
- 3 doublons annulés via script Node.js `.mjs` (supabaseAdmin, annulation propre)
- Réservation conservée : `#E989F061` — Tel Aviv → Ben Gurion, 15 sept 14:00, 170₪

### Page reçu imprimable
- `app/[locale]/receipt/[id]/page.tsx` — server component, fetch Supabase (supabaseAdmin)
- `app/[locale]/receipt/[id]/PrintButton.tsx` — client component `window.print()`, `print:hidden`
- 5 langues (HE RTL, EN, FR, RU, ES), `robots: "noindex, nofollow"`
- Layout print-friendly : header bleu, bandeau vert "confirmé", ref mono, tableau détails, watermark URL
- `@media print` via classes Tailwind (`print:shadow-none`, `print:border-none`, etc.)

**Bouton impression dans emails confirmation client**
- Ajout label `print` à chaque template (`confirmationTemplates`) dans `lib/email.ts`
- Bouton "🖨️ Print / Save as PDF" → `https://www.moveotaxi.com/{locale}/receipt/{booking.id}`
- TypeScript : ajout `print: string` dans l'interface `labels`

**Renvoi email Chiedza**
- Email de confirmation + bouton impression renvoyé à chiedza05@icloud.com (#E989F061)
- Copie envoyée à support@moveotaxi.com avec bandeau "[COPIE]"

### Feature 1 — Message groupes chauffeurs

**Bouton "📤 Groupes" dans panel admin (mobile + desktop)**
- `components/AdminDashboard.tsx` — nouveau bouton orange `<Share2>` sur chaque réservation
- Clic → modale avec message hébreu pré-généré + bouton "📋 Copier le message"
- `generateDriverMessage(booking)` :
  - Date reformatée YYYY-MM-DD → DD.MM.YYYY
  - Villes en hébreu (`CITY_NAMES_HE`)
  - Véhicule : "מונית רגילה" (sedan) / "מינבוס 6 מקומות" (minibus)
  - Passagers, valises + trolleys (depuis champ `notes`)
  - Commission = 10% arrondie, prix chauffeur = 90%
  - Numéro de vol si présent
- Template du message généré :
```
🚕 *נסיעה חדשה זמינה*
📅 תאריך: DD.MM.YYYY
🕒 שעה: HH:MM
📍 איסוף: [ville HE]  ➡️ יעד: [ville HE]
🚐 רכב נדרש: [type]
👥 נוסעים: N
🧳 מזוודות: N | טרולי: N
💰 מחיר לנהג: NNN ₪  💵 עמלה: NN ₪
✈️ מספר טיסה: XXXX
מי שפנוי ומתאים שיכתוב בפרטי.
```

### Feature 2 — Message satisfaction post-course

**Bouton "⭐ Satisfaction" dans panel admin**
- Bouton jaune `<Star>` visible uniquement quand `booking.date < aujourd'hui`
- Clic → ouvre WhatsApp (`wa.me`) avec message pré-rempli dans la langue du client (HE/EN/FR/RU/ES)
- Marque automatiquement `FeedbackSent: true` dans le champ `notes` → bouton passe en gris "Envoyé"
- `buildFeedbackLink(booking)` : normalise numéro, dispatch locale via `Langue:` du champ notes
- `markFeedbackSent(booking)` : PATCH `/api/bookings/{id}` avec `{ notes: updatedNotes }` + update état local

**API mise à jour**
- `app/api/bookings/[id]/route.ts` — nouveau cas PATCH : `body.notes !== undefined && !_full_update` → update `notes` seul (sans toucher au statut)

**Format notes étendu :**
```
FeedbackSent: true    ← ajouté par markFeedbackSent()
```
Parsé par `parseNotes()` dans AdminDashboard : `/FeedbackSent:\s*true/i`.

### Commits de la session
| Description |
|-------------|
| feat: WhatsApp button in admin notification email (5 locales) |
| fix: remove Estimated from all email/WA price labels |
| fix: white-space nowrap on date cell in client email |
| feat: printable receipt page /[locale]/receipt/[id] |
| feat: print button in client confirmation emails |
| feat: driver groups WhatsApp message generator in admin |
| feat: post-trip satisfaction WhatsApp button in admin |
| feat: PATCH /api/bookings/[id] supports notes partial update |

---

## Session du 2026-08-25

### Audit SEO comparatif (03/08 → 09/08 → 17/08 → 25/08)

Données GSC relevées via MCP `gsc-moveo` :

| Route / Requête | Pos. 17/08 | Pos. 25/08 | Δ |
|----------------|------------|------------|---|
| taxi jerusalem ben gurion | – | 54.8 | –  |
| taxi jerusalem to ben gurion airport price | 73.7 | 68.2 | -5.5 ✅ |
| tel aviv ben gurion taxi | 85.7 | 85.7 | = stagnant |
| taxi tel aviv netanya | 20.2 | ~20 | proche page 1 |
| /he bounce rate | – | 59% | vs /fr 24%, /en 44% |

Conclusion : Jerusalem BGN continue sa progression grâce au contenu FR/RU ajouté le 17/08. Tel Aviv BGN stagne (pas de contenu enrichi). Tel Aviv Netanya en pos 20 = cible page 1.

**3 actions prioritaires retenues :**
1. Tel Aviv → Ben Gourion : ajouter contenu FR + RU (stagnation pos 85.7)
2. Tel Aviv → Netanya : ajouter contenu EN + HE (pos 20.2, à une position de la page 1)
3. Bounce /he à 59% : rediriger les route cards homepage vers les pages de route (pas directement vers le booking form)

### SEO — Enrichissement route-content.ts

**`tel-aviv-ben-gurion`** — nouveau slug (n'existait pas dans route-content.ts)
- **EN** : 5 FAQs (prix, durée, fixe malgré Ayalon, terminal, quartiers TLV)
- **HE** : 5 FAQs en hébreu (même structure, marché local)
- **FR** : 5 FAQs en français (prix, durée, trafic Ayalon, terminal, quartiers)
- **RU** : 5 FAQs en russe (prix, durée, trafic, terminal, 24/7)
- Contenu "About" dans les 4 langues : kv20/Ayalon, 20 km, 25–35 min, prix fixe

**`tel-aviv-netanya`** — nouveau slug
- **EN** : 5 FAQs (prix, durée, direct sans partage, route kv2, aller-retour)
- **HE** : 4 FAQs en hébreu (prix, durée, direct, aller-retour)
- Contenu "About" : kv2 côtier, 30 km, 35 min normal, 50–60 min rush hour

**Résultat** : `lib/route-content.ts` passe de 7 slugs / 10 variantes à **9 slugs / 18 variantes locale**

### Fix bounce rate /he — Route cards homepage

`app/[locale]/page.tsx` : composant `RouteCard` — changement du `href`

Avant :
```tsx
const params = new URLSearchParams({ type, from, to, direction: "to_airport" });
href={`/${locale}/booking?${params.toString()}`}
```

Après :
```tsx
const slug = `${route.from.replace(/_/g, "-")}-${route.to.replace(/_/g, "-")}`;
href={`/${locale}/route/${slug}`}
```

**Pourquoi :** les 4 cartes de routes (Jerusalem, TLV, Haifa, Beer Sheva → BGN) menaient directement au formulaire de booking → taux d'abandon élevé sur /he. En passant par la page de route (qui contient contenu + widget de réservation), les visiteurs passent plus de temps sur le site avant de convertir. S'applique à toutes les langues (effet bénéfique global).

### Déploiement
- Build Vercel : `✓ Compiled` — 206 pages statiques générées
- Production : https://www.moveotaxi.com

### À faire pour accélérer l'indexation
- Demander recrawl manuel dans GSC pour :
  - `/en/route/tel-aviv-ben-gurion`, `/fr/route/tel-aviv-ben-gurion`, `/ru/route/tel-aviv-ben-gurion`
  - `/en/route/tel-aviv-netanya`

---

## Sessions du 2026-10-11 au 2026-11-19

### ⚠️ Régression de production à corriger en priorité
Avant le 11/10, le site était déployé depuis le poste local (fichiers non commités inclus). Depuis le 11/10, les déploiements passent par `git push` → Vercel, qui ne contient **pas** ces fichiers locaux. Conséquences en production :
- `/[locale]/receipt/[id]` → **404** (dossier `app/[locale]/receipt/` jamais commité ; les liens envoyés aux clients sont cassés)
- Admin : boutons « 📤 Groupes » (`generateDriverMessage`) et « ⭐ Satisfaction » (`buildFeedbackLink`) absents
- Emails : lien vers le reçu absent (`lib/email.ts` local non commité)
- Aussi non déployés : `app/[locale]/page.tsx`, `Navbar.tsx`, `WhatsAppButton.tsx`, `WhatsAppLinkTracked.tsx`, `app/api/bookings/[id]/route.ts` (PATCH notes), `scripts/gen-icons.js`

**Correction :** commiter ces fichiers (le build complet passe en local), pousser, puis ne plus déployer que via Git.

### Sécurité Google Workspace
- Email « Risques de sécurité potentiels » vérifié : légitime (`workspace-noreply@google.com`), pas un piratage
- DNS moveotaxi.com : MX Google ✅, SPF ✅, DMARC `p=quarantine` ✅, **DKIM absent** ❌ → procédure donnée (Admin → Gmail → Authentifier les e-mails → TXT `google._domainkey` chez GoDaddy). Statut : non vérifié
- Recommandé : 2FA obligatoire sur le compte admin

### Audit SEO complet (11/10)
Doc : https://claude.ai/code/artifact/0b193258-b0bc-4523-80ab-65f56567eb03
- 3 mois GSC : 67 clics / 2 296 impressions (CTR 2,9 %) ; position moyenne 28 → 7 (mobile 9,9, desktop 36,3)
- GA4 : 331 sessions — Direct 135, Organique 100, **Assistants IA 92 (28 %)**
- Pages RU de routes les mieux classées (pos. 5–7) ; Jérusalem→BGN EN pos. 69, TLV→BGN EN pos. 81

### Corrections SEO techniques — commit `f7cfaaf`
- `lib/seo.ts` (nouveau) : `localeAlternates(locale, path)` → canonical + hreflang 5 langues + x-default
- `/booking`, `/privacy`, `/terms` : `generateMetadata` (avant : canonical = accueil) ; clés `meta.booking|privacy|terms` dans `messages/*.json`
- hreflang rétabli sur about, airport, contact, drivers
- Titres : template `"%s"` dans le layout (plus de « | Moveo Taxi | Moveo Taxi ») ; titres de routes sans marque, < 60 caractères, « מונית » en hébreu
- FAQ route : la page affiche `allFaqs` (cohérent avec le schéma FAQPage)
- Blog : hreflang limité aux langues où l'article est publié
- `/routes` : cartes générées depuis `ROUTE_PAGES` (23 cartes, dont Ashdod) ; carte affichée même sans prix si page de route
- `/airport` : grille depuis `ROUTE_PAGES` + prix Supabase, liens vers les pages de routes (anciens prix en dur faux : Jérusalem ₪180 au lieu de ₪270)
- Footer : 4 routes prioritaires, Taxi Eilat, Chauffeurs, Blog (clés `footer.blogLink`, `footer.eilatLink`)
- Sitemap : `/blog` ajouté, dates mises à jour

### Contenu routes — commit `6bd240c`
- `ashdod-ben-gurion` : HE, EN, FR, RU (nouveau) ; `netanya-ben-gurion` : HE
- Mise en ligne du contenu local resté non commité : `tel-aviv-ben-gurion` (4 langues), `jerusalem-ben-gurion` FR/RU, `tel-aviv-netanya` EN/HE
- Textes volontairement généraux (pas de quartiers ni de prix en dur)

### Maillage interne — commit `103effd`
- Bloc « Autres trajets » sur chaque page de route : 6 liens + « Toutes les routes »
- `getRelatedRoutes()` dans `lib/route-pages.ts` : même ville d'abord, puis routes aéroport prioritaires

### Google Analytics / Search Console
- GA4 : règle de trafic interne « Moi » (IPv4 + plage IPv6 /64) + filtre « Internal Traffic » **actif**
- GSC : sitemap renvoyé ; indexation demandée pour `/en/route/jerusalem-ben-gurion`, `/he/route/jerusalem-ben-gurion`, `/en/booking`
- Octobre : la recherche organique devient la 1re source (48 sessions), devant Direct (21) et IA (11)

### Agents IA SEO — en pause (commit `3953607`)
- Interrupteur `AGENTS_PAUSED = true` dans `lib/anthropic.ts` : crons et déclenchements manuels répondent sans appeler Claude
- Problèmes constatés avant la pause : articles du writer jamais publiés (brouillons) et non enregistrés depuis le 26/10 ; score de l'auditeur illisible (« ?/100 ») ; prix inventés dans les titres d'articles ; aucun rapport lu
- Pour réactiver : `AGENTS_PAUSED = false` + corriger ces points

### Brainstorm croissance (29/10)
- Problème principal : commandes WhatsApp non saisies dans le site → pas de reçu, d'avis, de stats
- Pistes : bouton « Coller un message WhatsApp » qui pré-remplit la réservation via Claude Haiku ; réponses rapides avec lien de réservation pré-rempli ; passage à l'app WhatsApp Business (gratuit) ; assistant WhatsApp API plus tard (~50–200 ₪/mois)
- Autres leviers : suivi des conversions GA4, proposition du trajet retour, test Google Ads Jérusalem/TLV↔BGN, plateformes de transferts, communautés olim FR/RU, partenariats hôtels/Airbnb
- Distances à vérifier dans `lib/route-pages.ts` (Netanya↔BGN affiché 30 km, plutôt ~45 km ; Ashdod↔BGN 40 km, plutôt ~45–50 km)

---

## Backlog

- [x] Déployer sur Vercel + ajouter `GA4_REFRESH_TOKEN` / `GA4_PROPERTY_ID` dans variables Vercel
- [x] Créer contenu dédié Netanya ↔ Ben Gourion (route-content.ts EN implémenté)
- [x] Bouton WhatsApp dans email notification admin
- [x] Page reçu imprimable + bouton impression dans emails confirmation
- [x] Message groupes chauffeurs (panel admin, génération automatique HE)
- [x] Message satisfaction post-course (panel admin, 5 langues, suivi envoi)
- [x] Optimiser Jerusalem ↔ Ben Gourion dans les 4 langues (EN+HE le 09/08, FR+RU le 17/08)
- [x] Tel Aviv → Ben Gourion : contenu EN+HE+FR+RU ajouté (25/08)
- [x] Tel Aviv → Netanya : contenu EN+HE ajouté (25/08)
- [x] Fix bounce /he : route cards homepage → pages de route (25/08)
- [ ] **Commiter et déployer les fichiers locaux (reçu, boutons Groupes/Satisfaction, emails) — régression prod depuis le 11/10**
- [x] Corrections SEO techniques : canonical, hreflang, titres, FAQ, maillage (11/10)
- [x] Ashdod ↔ BGN 4 langues + Netanya ↔ BGN HE (11/10)
- [x] Bloc « Autres trajets » sur les pages de routes (11/10)
- [x] Filtre trafic interne GA4 actif (11/10)
- [ ] Demander indexation GSC : `/en/route/tel-aviv-ben-gurion`, `/he/route/ashdod-ben-gurion`
- [ ] DKIM Google Workspace (enregistrement TXT GoDaddy) + 2FA admin
- [ ] Corriger les distances de `lib/route-pages.ts` (Netanya, Ashdod…)
- [ ] Bouton « Coller un message WhatsApp » → réservation pré-remplie (IA)
- [ ] Passer à WhatsApp Business + réponses rapides avec lien de réservation
- [ ] Collecte d'avis Google (lien d'avis GBP à fournir)
- [ ] Retravailler la page EN Jérusalem → BGN (prix en haut, comparatif taxi/train/sherout)
- [ ] Suivi des conversions GA4 (début de réservation → réservation confirmée)
- [ ] Agents IA : corriger publication des articles, score auditeur, prix réels — puis réactiver
- [ ] Ajouter "4 grandes valises" sur toutes les pages aéroport
- [ ] Analyser concurrents sur Jérusalem → Ben Gourion avec Playwright
- [ ] Corriger présence /es (marché espagnol, 0 signal GSC)
- [ ] Exécuter plan admin SEO (WriterDetail + onglet Articles) — voir plan `inherited-toasting-snowflake.md`
- [ ] Intégration WhatsApp Business API (Twilio/360dialog) pour messages automatiques post-course
