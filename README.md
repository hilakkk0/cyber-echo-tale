# Cyber Echo Tale (Neon Protocol)

A dark, cyberpunk-themed interactive story game that runs in the browser. You wake up in a neon-lit room with no memory and make choices that decide whether you escape. The game is in Turkish.

**Play it live:** https://hilakkk0.github.io/cyber-echo-tale/

*Türkçe:* Karanlık, siberpunk temalı, seçimlerle ilerleyen bir macera oyunu. Bir operatör adıyla giriş yapıyorsun, ilerlemen tarayıcında kayıtlı kalıyor.

## How it plays

You pick a character name, then work through three chapters. Each choice leads to a different scene, and a chapter can end in a win or a loss.

| Chapter | Setting | Mechanic |
|---|---|---|
| 1. Neon Oda | A locked neon-lit room | Pure story choices |
| 2. ARIA Laboratuvarı | A lab with a rising AI | 90-second countdown |
| 3. Siber-Sığınak | An underground bunker with traps | Health bar |

- Chapters unlock as you win the previous one.
- Progress is saved per player name in your browser (localStorage). No account or server is needed.

## Tech stack

- TypeScript and React
- TanStack Router (client-side routing) with Vite
- Tailwind CSS and shadcn/ui components
- Bun as package manager
- Deployed to GitHub Pages with GitHub Actions

## Run locally

```bash
bun install
bun run dev
```

Then open the local address printed in the terminal.

## Project structure

- `src/lib/story.ts`: chapters, scenes and choices (the whole story lives here)
- `src/lib/player-storage.ts`: player profiles and saved progress
- `src/components/Game.tsx`: game screen, timer and health logic
- `src/components/LoginScreen.tsx`: operator name screen
- `.github/workflows/`: automatic build and deployment to GitHub Pages
