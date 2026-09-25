# Payana Mitra

> Travel, thoughtfully planned.

Payana Mitra is a personalized trip-planning web application. It helps travellers create itineraries around their preferences, budget, pace, and travel style instead of relying on generic destination lists.

## Current status

The initial frontend is complete for:

- Landing page
- Login page
- Signup page
- Personalized dashboard layout
- Left navigation sidebar
- Chat prompt interface
- Responsive mobile layout
- Forest + Ocean visual system

Authentication and AI calls are currently frontend placeholders. The next phase will connect Better Auth, Neon Postgres, OpenRouter, and Groq.

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

Install dependencies:

```bash
npm install
```

Copy the environment template:

```bash
cp .env.example .env.local
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
├── page.tsx                 # Landing page
├── login/
│   └── page.tsx              # Login page
├── signup/
│   └── page.tsx              # Signup page
├── dashboard/
│   └── page.tsx              # Dashboard route
├── globals.css               # Shared design system and responsive styles
└── layout.tsx                # Root layout and metadata

components/
├── auth-form.tsx              # Login/signup frontend form
└── dashboard.tsx              # Dashboard interface and chat prototype
```

## Design system

The frontend follows the Forest + Ocean direction from the Payana Mitra colour schema.

### Core colours

```text
Ink:     #202827
Paper:   #F7F5EE
Forest:  #164A3A
Ocean:   #357A8A
Accent:  #D4773C
```

### Typography

- `DM Serif Display` — display headings and expressive UI text
- `Inter` — body copy, forms, navigation, and application UI

### Visual principles

- Destination-led storytelling
- Calm, structured layouts
- Large but readable serif headings
- Subtle borders instead of excessive shadows
- Forest green for primary navigation and actions
- Ocean blue for secondary and informational elements
- Accent orange used sparingly for memorable interactions
- Mobile-first responsive behavior

## Planned backend flow

1. Connect Better Auth to the Next.js route handlers.
2. Connect Better Auth to Neon Postgres.
3. Add database tables for users, sessions, preferences, conversations, messages, and itineraries.
4. Protect `/dashboard` with a server-side session check.
5. Add a server-only `/api/chat` route.
6. Use OpenRouter as the primary provider.
7. Fall back to Groq when the primary provider is unavailable.
8. Persist chat conversations and generated itineraries.
9. Deploy the frontend and backend to Vercel.

## Scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run linting when configured
```

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
