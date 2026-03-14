# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (hot reload at http://localhost:1313)
hugo server

# Production build
hugo --minify

# Create new content
hugo new content/events/YYYY-MM-event-name.md
hugo new content/speakers/speaker-name.md
hugo new content/blog/post-title.md
```

**Requirements:** Hugo Extended 0.120.0+ and Dart Sass (`brew install dart-sass`).

## Deployment

- `source` branch — development (current working branch)
- `main` branch — production (deployed via GitHub Actions to GitHub Pages)
- CI builds automatically on push to `source` using `.github/workflows/deploy.yml`

## Architecture

Hugo static site for YAJUG (Java User Group Luxembourg). Content is in `content/`, the custom theme is in `themes/yajug/`.

### Content sections

| Section | Path | Notes |
|---------|------|-------|
| Events | `content/events/` | Named `YYYY-MM-event-name.md`; frontmatter includes `event_date`, `event_time`, `duration`, `venue`, `speakers` (list), Eventbrite/Meetup URLs |
| Speakers | `content/speakers/` | Referenced by events via speaker slug; includes `photo`, `role`, `company`, social links |
| Blog | `content/blog/` | Standard blog with tags/categories |
| Team | `content/team/` | Data-driven from `data/team.yaml` |
| Sponsors | `data/sponsors.yaml` | Sponsor metadata |

### Theme (`themes/yajug/`)

- `layouts/_default/baseof.html` — base template wrapping all pages
- `layouts/partials/` — shared components: `event-card.html`, `speaker-card.html`, `avif-picture.html`, `sponsors.html`
- `assets/css/style.css` — single stylesheet; uses CSS custom properties (Luxembourg red `#C8102E`, blue `#005F8E`)
- `assets/js/main.js` — minimal JS

### i18n

UI strings are in `i18n/en.yaml`. Use `{{ i18n "key" }}` in templates.

### Images

Speaker photos are stored as both AVIF and JPEG in `static/images/speakers/`. Use the `avif-picture.html` partial for responsive image rendering.
