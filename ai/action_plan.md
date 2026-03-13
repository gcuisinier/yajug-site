# Plan d'action : Refonte yajug.lu en Hugo

## Contexte

Le site actuel yajug.lu tourne sous WordPress + thème GoodLayers.
Objectif : reconstruire entièrement avec **Hugo** (générateur de site statique).

**Choix retenus :**
- Thème custom développé from scratch
- Contenu Markdown réécrit (pas de migration WordPress)
- Contact simplifié : mailto + lien mailing list (pas de formulaire dynamique)

---

## Analyse du site existant (https://yajug.lu)

### Pages / sections

| URL | Contenu |
|-----|---------|
| `/` | Homepage : hero event, mission, sponsors (15+), articles récents |
| `/program/` | Liste des events (date, heure, lieu, speakers, lien Eventbrite) |
| `/blog/` | Articles/news avec image, auteur, tags, pagination |
| `/speakers/` | Grille de speakers (40+) avec photo, nom, rôle, réseaux sociaux |
| `/about-us/` | Membres du bureau (13) avec photo, rôle, réseaux sociaux |
| `/contact/` | Contact simplifié (mailto + lien mailing list) |

### Types de contenu

- **Events** : date, heure, lieu, speaker(s), description, URL Eventbrite, past/upcoming
- **Blog posts** : titre, date, auteur, image, excerpt, contenu, catégories/tags
- **Speakers** : nom, photo, bio, liens sociaux, rôle/titre → pages dédiées
- **Team members** : nom, photo, rôle, liens sociaux → `data/team.yaml`
- **Sponsors** : logo, nom, URL, tier → `data/sponsors.yaml`

---

## Structure du projet Hugo

```
yajug-site/
├── hugo.toml                    ← Config principale
├── ai/
│   └── action_plan.md           ← Ce fichier
├── archetypes/
│   ├── events.md
│   ├── blog.md
│   └── speakers.md
├── content/
│   ├── _index.md                ← Homepage front matter
│   ├── program/                 ← Events
│   ├── blog/
│   ├── speakers/
│   ├── about-us/
│   └── contact/
├── data/
│   ├── sponsors.yaml            ← Tiered: platinum, gold, community
│   └── team.yaml                ← Membres du bureau
├── i18n/
│   └── en.yaml                  ← Strings (prêt pour FR)
├── static/
│   └── images/
│       ├── sponsors/
│       ├── speakers/
│       └── team/
└── themes/yajug/
    ├── theme.toml
    ├── assets/
    │   ├── css/style.css        ← Design system complet
    │   └── js/main.js           ← Vanilla JS (burger menu, scroll)
    └── layouts/
        ├── _default/
        │   ├── baseof.html      ← Template de base (CRITIQUE)
        │   ├── home.html
        │   ├── single.html
        │   └── list.html
        ├── program/list.html + single.html
        ├── blog/list.html + single.html
        ├── speakers/list.html + single.html
        ├── about-us/single.html
        ├── contact/single.html
        ├── shortcodes/
        │   ├── eventbrite.html
        │   └── callout.html
        └── partials/
            ├── head.html + head/{css,js,meta}.html
            ├── header.html + footer.html + hero.html
            ├── sponsors.html
            ├── event-card.html + speaker-card.html
            ├── team-card.html + blog-card.html
            ├── recent-posts.html + social-icons.html
```

---

## Front matter schemas

### Event (`content/program/*.md`)
```yaml
title: "Spring Boot 3 Deep Dive"
date: 2025-03-18T18:30:00+01:00
event_date: 2025-03-18
event_time: "18:30"
venue: "Foyer Européen, Luxembourg"
eventbrite_url: "https://..."
past: false
featured: false
speakers:
  - name: "Jane Doe"
    slug: "jane-doe"
tags: ["spring-boot"]
description: "Teaser court affiché sur les cards"
```

### Speaker (`content/speakers/*.md`)
```yaml
title: "Jane Doe"
slug: "jane-doe"
photo: "/images/speakers/jane-doe.jpg"
role: "Software Architect"
company: "Telindus"
social:
  twitter: "janedoe"
  linkedin: "jane-doe-lux"
  github: "jane-doe"
```

### Blog post (`content/blog/*.md`)
```yaml
title: "Recap : Spring Boot Meetup"
date: 2025-03-22T10:00:00+01:00
author: "YAJUG Team"
featured_image: "/images/blog/2025-03-recap.jpg"
excerpt: "..."
tags: ["recap", "spring-boot"]
```

---

## Décisions techniques

| Sujet | Choix | Raison |
|-------|-------|--------|
| CSS | Vanilla CSS + Hugo Pipes (minify + fingerprint) | Pas de Node/npm requis |
| JS | Vanilla JS | Site content-heavy, pas une SPA |
| Speakers | Content files (`/speakers/*.md`) | Nécessitent une URL routable |
| Team/Sponsors | `data/*.yaml` | Sections embarquées, pas de pages dédiées |
| Events past/upcoming | Front matter `past: bool` | Simple pour les auteurs |
| i18n | Strings EN maintenant, FR ajoutables sans refactoring | Futur-proofing à coût zéro |
| Formulaire contact | Mailto + lien mailing list | Décision utilisateur |

---

## Phases d'implémentation

### ✅ Phase 1 — Scaffold + Shell (Jour 1)
- [x] `hugo new site` initialisé
- [x] Structure de répertoires créée
- [x] `hugo.toml` complet (config, menus, params, permalinks, taxonomies)
- [x] `themes/yajug/theme.toml`
- [x] `baseof.html` + `home.html` squelettes
- [x] Partials `head.html`, `header.html`, `footer.html` squelettes
- [x] `style.css` avec custom properties et reset
- [x] `main.js` avec burger menu
- [x] `content/_index.md`
- [ ] ✅ Vérification : `hugo server -D` tourne à localhost:1313

### Phase 2 — Design system (Jours 2–3)
- [ ] Couleurs et fonts YAJUG dans les custom properties CSS
- [ ] `.site-header` : logo, nav desktop, burger/mobile nav
- [ ] `.site-footer` : social links, copyright, lien mailing list
- [ ] `.hero` avec image de fond
- [ ] Composants `.btn`, `.social-icon`
- [ ] Test responsive (768px, 1024px)

### Phase 3 — Templates de contenu (Jours 4–6)
- [ ] `/program/` — list + single + `event-card.html` + archetype + 2 events exemple
- [ ] `/speakers/` — list + single + `speaker-card.html` + archetype + 3 speakers exemple
- [ ] `/blog/` — list + single + `blog-card.html` + archetype + 1 post exemple
- [ ] `/about-us/` — single + `team-card.html` + `data/team.yaml` exemple
- [ ] `/contact/` — single avec mailto + lien mailing list
- [ ] Homepage — complet avec featured event, mission, sponsors, articles récents

### Phase 4 — Contenu réel (Jours 7–9)
- [ ] `data/sponsors.yaml` avec vrais logos YAJUG
- [ ] `data/team.yaml` avec vrais membres du bureau
- [ ] Fiches speakers réels
- [ ] 5–10 articles blog en Markdown
- [ ] Events à venir + events passés récents
- [ ] Images optimisées (WebP recommandé)

### Phase 5 — SEO + Deploy (Jours 10–12)
- [ ] Open Graph + Twitter Card
- [ ] Test build prod : `hugo --minify`
- [ ] Config déploiement (Netlify / GitHub Pages / Cloudflare Pages)
- [ ] Bascule DNS depuis WordPress

---

## Commandes utiles

```bash
# Dev
hugo server -D --navigateToChanged

# Nouveau contenu
hugo new program/2025-04-jug-quarkus.md
hugo new blog/2025-04-recap.md
hugo new speakers/jane-doe.md

# Build prod
hugo --minify
```
