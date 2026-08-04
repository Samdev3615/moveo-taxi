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

## Backlog

- [ ] Déployer sur Vercel + ajouter `GA4_REFRESH_TOKEN` / `GA4_PROPERTY_ID` dans variables Vercel
- [ ] Optimiser pages Jérusalem ↔ Ben Gourion dans les 5 langues (priorité #1)
- [ ] Ajouter "4 grandes valises" sur toutes les pages aéroport
- [ ] Créer contenu dédié Netanya ↔ Ben Gourion (angle mort majeur)
- [ ] Analyser concurrents sur Jérusalem → Ben Gourion avec Playwright
- [ ] Corriger indexation /es (quick win espagnol)
