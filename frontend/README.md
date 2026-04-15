# Nailytics Web

Next.js 14 + Tailwind frontend for the AI Nail Size Detector. Talks to the
FastAPI backend (`api.py`, in the project root) via a `/api/*` rewrite.

## Setup

```bash
cd web
npm install
npm run dev          # http://localhost:3000
```

In another terminal, start the backend:

```bash
# from the project root
/opt/miniconda3/envs/sustainpro/bin/uvicorn api:app --reload --port 8000
```

The Next dev server proxies `/api/*` → `http://localhost:8000/api/*`. To
point at a different backend, set `NEXT_PUBLIC_API_URL`.

## Pages

- `/` — landing
- `/how-it-works` — the science behind the calibration
- `/analyze` — upload / camera capture + results
- `/dashboard` — measurement history (mock)
- `/about`, `/contact`
