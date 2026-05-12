# VCPMC Contract Creation Form - Frontend

React + Vite + TypeScript + Tailwind frontend for VCPMC contract and certificate management.

## Stack

- **Framework**: React 18 + TypeScript
- **Build tool**: Vite 5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP**: Native Fetch API

## Getting Started

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5199` by default.

## Purpose

Frontend UI for VCPMC contract creation, management, and certificate generation.
This repo is the frontend-only component used for UI/UX development.

## Development Notes

- Backend/API is **not included** in this repo.
- API base URL and other environment variables can be configured via `.env.local`.
- Example `.env.local` entry: `VITE_API_BASE_URL=http://localhost:8000`

## Project Structure

```
src/
  components/   # Reusable UI components
  data/         # Static data / types
  lib/          # API clients, utilities
  modules/      # Feature modules
  pages/        # Page-level components
  App.tsx       # Root component
  index.tsx     # Entry point
```

---

*Originally generated from Magic Patterns Vite Template.*
*Maintained for VCPMC contract management UI.*
