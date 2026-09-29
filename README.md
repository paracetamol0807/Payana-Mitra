# Payana Mitra

> Travel, thoughtfully planned.

Payana Mitra is a personalized trip-planning web application. It helps travellers create itineraries around their preferences, budget, pace, and travel style instead of relying on generic destination lists.

## Current status

The app is connected end to end:

- Landing page
- Email/password signup and login with Better Auth
- Neon Postgres session and application data storage
- Protected personalized dashboard
- Streaming travel chat with persisted conversations
- OpenRouter as the primary AI provider
- Groq as the fallback AI provider
- Trip history in the dashboard sidebar

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind-ready frontend architecture
- CSS variables and shared design tokens
- Better Auth — planned
- Neon Postgres — planned
- Drizzle ORM — planned
- OpenRouter — primary AI provider
- Groq — fallback AI provider
- Vercel — planned deployment platform

## Getting started

### Requirements

- Node.js 20 or newer
- npm
- A Neon Postgres database
- An OpenRouter API key and model ID
- A Groq API key and model ID

Install dependencies:

```bash
npm install
```

Copy the environment template:

```bash
cp .env.example .env.local
```

`BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must be the URL of your own app, not a Neon Auth endpoint. For local development both should be `http://localhost:3000`.

Push the database schema to Neon:

```bash
npm run db:push
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available routes

| Route | Description |
| --- | --- |
| `/` | Payana Mitra landing page |
| `/login` | Login interface |
| `/signup` | Account creation interface |
| `/dashboard` | Personalized trip-planning dashboard prototype |

## Environment variables

All environment variables are documented in `.env.example`.

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000

DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require

OPENROUTER_API_KEY=replace-with-your-openrouter-api-key
# Required when the AI integration is enabled.
# Use an exact model ID listed at https://openrouter.ai/models
OPENROUTER_MODEL=replace-with-an-openrouter-model-id

GROQ_API_KEY=replace-with-your-groq-api-key
GROQ_MODEL=replace-with-your-groq-model-id
```

Keep `.env.local` private. Never commit API keys, database credentials, or Better Auth secrets.

## Project structure

```text
app/
├── api/
│   ├── auth/[...all]/route.ts  # Better Auth handler
│   └── chat/route.ts           # Authenticated AI chat endpoint
├── login/page.tsx
├── signup/page.tsx
├── dashboard/
│   ├── layout.tsx              # Session-protected dashboard shell
│   └── page.tsx
├── globals.css
└── layout.tsx

components/
├── auth-form.tsx
└── dashboard.tsx

lib/
├── ai.ts                       # OpenRouter + Groq provider chain
├── auth.ts                     # Better Auth server instance
├── auth-client.ts              # Better Auth browser client
├── db.ts                       # Neon + Drizzle connection
└── schema.ts                   # Auth, conversation, and itinerary tables
```

## Design system

The frontend follows the **Desert Heritage** direction from the Payana Mitra colour schema: royal, warm, and cultural, inspired by Indian architecture, desert landscapes, and royal destinations.

### Core colours

```text
Text:      #292522
Background:#FBF3E3
Primary:   #3A2418
Secondary: #B85C38
Accent:    #D49A32
```

### Typography

- `DM Serif Display` — display headings and expressive UI text
- `Inter` — body copy, forms, navigation, and application UI

### Visual principles

- Destination-led storytelling
- Calm, structured layouts
- Large but readable serif headings
- Subtle borders instead of excessive shadows
- Deep brown for primary navigation, sidebars, and actions
- Terracotta for secondary and informational elements
- Heritage gold used sparingly for memorable interactions
- Mobile-first responsive behavior

## Backend flow

1. Better Auth handles signup, login, sessions, and cookies.
2. Neon Postgres stores users, sessions, conversations, messages, itineraries, and preferences.
3. `app/dashboard/layout.tsx` redirects unauthenticated visitors to `/login`.
4. `POST /api/chat` verifies the session, persists the user message, and streams the assistant reply.
5. OpenRouter is called first. If it is missing, misconfigured, rate limited, or unavailable, the request automatically falls back to Groq.
6. The active provider is returned in the `X-AI-Provider` response header.
7. `GET /api/chat` returns the trip history. `GET /api/chat?conversationId=...` returns one conversation.

## Scripts

```bash
npm run dev         # Start the development server
npm run build       # Create a production build
npm run start       # Start the production server
npm run lint        # Run linting when configured
npm run db:push     # Push the Drizzle schema to Postgres
npm run db:generate # Generate SQL migration files
npm run db:studio   # Open Drizzle Studio
```

## AI provider configuration

Both providers need a key and a model ID. Placeholder values such as `replace-with-...` are treated as unconfigured and are skipped, so a placeholder `OPENROUTER_MODEL` means Groq handles the request.

```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=provider/model-id

GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
```

Find an exact OpenRouter model ID at <https://openrouter.ai/models> and a Groq model ID at <https://console.groq.com/docs/models>.

## Deployment

The recommended production setup is:

```text
Next.js frontend and API routes → Vercel
Authentication and application data → Neon Postgres
Primary AI provider → OpenRouter
Fallback AI provider → Groq
```

Add the production environment variables in the Vercel project settings. Use a pooled Neon connection string when required by the deployment environment.

## Security notes

- AI provider keys must only be used on the server.
- Do not rename provider variables to `NEXT_PUBLIC_*`.
- Never expose `DATABASE_URL` in client-side code.
- Derive the authenticated user from the server session.
- Do not trust user IDs supplied by the browser.
- Validate all AI output before displaying or storing it.
- Add rate limiting before launching the public production version.

## License

This project is currently private and intended for the Payana Mitra team.
