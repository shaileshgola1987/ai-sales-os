# AI Sale OS (SalesOS)

Sales operating system for B2B teams: command-center dashboard, AI-scored leads, WhatsApp CRM, pipeline kanban, quotations, field SFA, and an AI sales assistant. The first slice is a working web app with mock data, designed to match the [Figma site](https://mess-eel-96169463.figma.site/).

**Stack:** Next.js (App Router, TypeScript, Tailwind) + Node/Express mock API.

The PRD PDF was not available in this environment (`/opt/cursor/project/attachments/docs/AI_SalesOS_PRD.pdf`). Screens and copy follow the live Figma prototype.

## Ports

| Service | Port | URL |
| --- | --- | --- |
| Next.js UI | **43123** | http://127.0.0.1:43123 |
| Express API | **43124** | http://127.0.0.1:43124/api/health |

## Run locally

```bash
npm install
npm run dev
```

Then open http://127.0.0.1:43123

- `npm run dev:web` — UI only  
- `npm run dev:api` — API only  

The Next.js dev server proxies `/api/*` to Express.

## Clone / pull onto the intended laptop path

This repo cannot write to `/home/shailesh/ai-sale-os`. After you have the remote URL (or once origin is set), use that folder:

```bash
# first time, if the folder is empty
git clone <repo-url> /home/shailesh/ai-sale-os
cd /home/shailesh/ai-sale-os
git checkout cursor/ai-sale-os-37c0
npm install
npm run dev
```

If the folder already has a clone:

```bash
cd /home/shailesh/ai-sale-os
git fetch origin
git checkout cursor/ai-sale-os-37c0
git pull origin cursor/ai-sale-os-37c0
npm install
npm run dev
```

## Screens in this slice

- Sales Command Center (dashboard)
- Lead Management (search, hot/warm/cold, new lead)
- Sales Pipeline (kanban, empty Won column)
- WhatsApp CRM (inbox, thread, AI suggested replies, lead details)
- Customer Management
- Quotation Management
- Tasks & Follow-ups
- Field Sales Automation
- AI Sales Assistant
- Analytics & Reports

No login or database: mock data lives in `server/data.ts`.
