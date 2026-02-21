<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Quran Reader App – Copilot Instructions

## Stack
- **Framework**: React 19 + TypeScript (Vite)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Routing**: React Router v7
- **Quran Data**: `@quranjs/api` – use `quran.v4.*` endpoints
- **Icons**: `lucide-react`

## Conventions
- All pages go in `src/pages/`, all reusable components in `src/components/`
- Progress is stored in `localStorage` via helpers in `src/utils/progress.ts`
- API calls are wrapped in `src/utils/api.ts`
- Types are centralized in `src/types/index.ts`
- Use `useProgressContext()` from `src/context/ProgressContext.tsx` for progress state
- Arabic text uses `.font-arabic` class (Amiri font, RTL)
- Dark theme: slate-900/950 backgrounds, emerald-400/500 accents, amber for bookmarks
