# AI Code Editor Avatar

Repository: `Ai_codeEdtor_avator`

A React and Node.js starter project for an AI developer assistant. The app lets a user write code, request AI-style help, run a simple security scan, and hear the result through a browser speech avatar.

## Tech Stack

- React with Vite
- Monaco Editor
- Axios
- Node.js with Express
- Web Speech API

## Setup

Install client dependencies:

```bash
cd client
npm install
```

Install server dependencies:

```bash
cd server
npm install
```

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-2.5-flash-lite
```

Run backend:

```bash
cd server
npm run dev
```

Run frontend:

```bash
cd client
npm run dev
```

Open the app at `http://localhost:5173`.

## Project Flow

User writes code, clicks an action, the frontend sends the code to the backend, the backend processes the AI or scanner request, and the output panel displays the result. The avatar can read the result aloud.

## Voice Commands

The browser voice control supports simple commands:

- `scan security`
- `explain code`
- `fix code`
- `generate code`

Other dictated speech is added to the editor as a voice note.

## Docs

Planning files are in `docs/`:

- `project-plan.md`
- `remaining-work.md`
