# Quran Reader App

A modern Quran reading web app built with React 19, TypeScript, and Tailwind CSS v4.

## Features

- 📖 **Read all 114 Surahs** with Arabic text (Amiri font) and English translation
- 🔖 **Bookmarks** — save any verse and jump back to it instantly
- ✅ **Progress tracking** — mark verses/pages as read, track per-chapter and overall progress
- 🔍 **Search & filter** chapters by name, number, or revelation place (Meccan/Medinan)
- 💾 **Persistent state** — all progress and bookmarks saved to `localStorage`
- 🌙 **Dark theme** — slate/emerald design, fully responsive

## Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript (Vite) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | React Router v7 |
| Quran Data | Quran CDN public API |
| Icons | lucide-react |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  components/    # Reusable UI (Sidebar, Navbar, ChapterCard, VerseCard)
  context/       # ProgressContext — global reading state
  pages/         # Dashboard, ChapterList, ChapterReader, Bookmarks
  types/         # Shared TypeScript interfaces
  utils/         # api.ts (fetch helpers) · progress.ts (localStorage helpers)
```
# quran
