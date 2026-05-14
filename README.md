# Beyblade X Resonance Quiz

English | [繁體中文](https://github.com/francistse/beyblade-x-resonance-quiz/blob/main/README_TC.md)

A personality quiz that matches you with your resonant Beyblade X through a vector-based matching algorithm. Answer 12 questions, discover your battle type, and find the Beyblade that resonates with your soul.

🎨 This project was developed with TRAE IDE — making web development easier and more enjoyable.

## Overview

| Feature | Description |
|---|---|
| **Personality Quiz** | 12 curated questions across 3 axes: Attack, Defense, Stamina |
| **Vector Matching** | Cosine distance algorithm matches your profile against 144 Beyblade X products |
| **Awakening Keyword** | Randomized resonance keyword based on your battle type |
| **Radar Chart** | Visual comparison of your stats vs. your matched Beyblade |
| **Multi-Language** | English, Traditional Chinese (繁體中文), Japanese (日本語) |
| **Share Results** | Download result image, copy link, or native share API |
| **Sound Effects** | Immersive audio feedback on quiz start and interactions |
| **Particle Background** | Animated wave-particle canvas background |

### Battle Types

| Type | Description |
|---|---|
| ⚔️ **Attack** | Aggressive, direct, high-impact — charges head-on |
| 🛡️ **Defense** | Calm, analytical, resilient — stands firm under pressure |
| 🌀 **Stamina** | Patient, enduring, strategic — outlasts the competition |
| ⚖️ **Balance** | Versatile, adaptive, well-rounded — reads and responds |

## How It Works

1. **Answer 12 Questions** — Each option maps to Attack / Defense / Stamina scores
2. **Normalize Your Vector** — Raw scores are normalized to a unit vector
3. **Cosine Distance Matching** — Your vector is compared against all 144 Beyblade stat vectors
4. **Balance Boost** — Balance-type users get prioritized matching with Balance Beyblades
5. **Top 3 Results** — The closest matches are displayed with fit percentage
6. **Awakening Keyword** — A randomized resonance phrase is assigned based on your type

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/francistse/beyblade-x-resonance-quiz.git
cd beyblade-x-resonance-quiz
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test
```

## Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

(You can still use the legacy anon key as `VITE_SUPABASE_ANON_KEY` if you prefer.)
```

> **Note:** Supabase is used for optional analytics tracking. The quiz functions fully without it.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts 3 |
| i18n | i18next + react-i18next |
| Analytics | Supabase |
| Image Export | html2canvas |
| Testing | Vitest + Testing Library |
| Linting | ESLint + typescript-eslint |

## Project Structure

- **`public/`** — static files served as-is
  - `images/products/` — Beyblade product images
  - `sounds/` — UI sound effects
- **`src/`** — application source
  - `assets/` — bundled images and logos
  - `components/` — React UI
    - `Quiz/` — intro, demographics, questions, navigation (`QuizForm.tsx`, `QuestionCard.tsx`, …)
    - `Results/` — radar chart, matches, awakening keyword, share card
    - `Share/` — share and download actions
    - `ui/` — `NavBar`, `Button`, `WaveParticleBackground`, …
  - `context/` — quiz and navigation state
  - `data/` — `beyblades.json`, questions, stat ranges
  - `hooks/` — quiz state, language, analytics, sound
  - `i18n/` — i18next setup
  - `lib/` — Supabase client helper
  - `locales/` — `en-US`, `zh-TW`, `ja-JP` JSON
  - `pages/` — `ResultPage` and other route-level views
  - `types/` — shared TypeScript types
  - `utils/` — matching algorithm, normalization, share image, `supabase` re-export
- **`.github/workflows/`** — GitHub Actions (Pages deploy)
- **Root config** — `index.html`, `vite.config.ts`, `package.json`, `tsconfig*.json`, `tailwind.config.js`, `postcss.config.js`, `vitest.config.ts`, `.env.example`

## Deployment

**Live site (GitHub Pages):** [https://francistse.github.io/beyblade-x-resonance-quiz/](https://francistse.github.io/beyblade-x-resonance-quiz/)

Pushes to `main` run [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml), which builds with Vite (`base` set for this repo path) and deploys via GitHub Actions.

You can also publish manually (creates/updates the `gh-pages` branch):

```bash
npm run deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Ways to Contribute

- Add new quiz questions or improve existing ones
- Add support for new languages
- Improve the matching algorithm
- Add new Beyblade product data
- Fix bugs or improve UI/UX

## License

MIT License — see [LICENSE](https://github.com/francistse/beyblade-x-resonance-quiz/blob/main/LICENSE) for details.

## Acknowledgments

- **TAKARA TOMY** — Beyblade X product line and franchise
- **[BEYBLADE X Viewer (beyblade.phstudy.org)](https://beyblade.phstudy.org/)** — Beyblade X product database and stat reference used in this quiz
- **TRAE IDE** — This project was built with TRAE IDE
- Sound effects from [Freesound](https://freesound.org/) community contributors

## Contact

**Project Maintainer:** Francis Tse

- Email: [francis.tse.mc@gmail.com](mailto:francis.tse.mc@gmail.com)
- LinkedIn: [https://www.linkedin.com/in/francis-tse-6a399a47/](https://www.linkedin.com/in/francis-tse-6a399a47/)
