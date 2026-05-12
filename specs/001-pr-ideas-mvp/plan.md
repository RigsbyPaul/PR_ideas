# Implementation Plan: PR Ideas MVP

## Architecture Overview
A full-stack Next.js application designed for speed and simplicity. It uses a "Hybrid Edge" model: Vercel for hosting, Turso for globally distributed data, and Google Drive for daily persistence.

## Technology Stack
- **Framework**: Next.js 16 (App Router, Tailwind CSS, Turbopack)
- **Database**: Turso (LibSQL) with Prisma 7 ORM
- **Deployment**: Vercel (Automatic GitHub Integration)
- **Authentication**: Secret-based access for Admin Dashboard (`ADMIN_SECRET`)
- **Backups**: Custom Python script triggered via Cron, uploading to Google Drive API.
- **Inbound Routing**: AgentMail inbox (`jakdor@agentmail.to`) synced via Cron (`scripts/sync-inbound.ts`).

## Data Model
### `Idea`
- `id`: String (UUID)
- `title`: String
- `description`: String (Markdown)
- `status`: Enum (DRAFT, PUBLISHED, PRIVATE)
- `imagePath`: String (optional)
- `aiText`: String (extracted content)
- `likes`: Integer (default 0)
- `dislikes`: Integer (default 0)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### `Comment`
- `id`: String
- `ideaId`: String (Relation)
- `content`: String
- `author`: String (Anonymous)
- `createdAt`: DateTime

## Implementation Phases

### Phase 1: Inbound Router & Storage
- Setup Next.js boilerplate.
- Initialize Prisma with SQLite.
- Implement a `/api/inbound` webhook or a script using `agentmail` to pull messages from `jakdor@agentmail.to`.
- Implement classification logic: check for "Expense" keywords vs. "Idea" content.

### Phase 2: AI Analysis & Draft Workflow
- Integrate OpenAI Vision API.
- Create a script that:
    1. Takes a new idea image.
    2. Asks the AI: "Describe this invention and suggest 3 clarifying questions for the inventor."
    3. Saves the description and questions to the database as a DRAFT.

### Phase 3: Web UI (Gallery & Detail)
- Create a Card-based grid on the home page.
- Build the Idea Detail page with the doodle, description, and "Like" button.
- Add search bar with basic filtering.

### Phase 4: Engagement & Safety
- Implement the "Like" API route (atomic increment).
- Implement the "Comment" form with a simple profanity filter (bad-words library or similar).

## Deployment Plan
- **Platform**: Vercel (Next.js native hosting).
- **Environment variables required**: `OPENAI_API_KEY`, `AGENTMAIL_TOKEN`, `ADMIN_SECRET`.
- **Workflow**: 
    1. Initialize Git repository.
    2. Deploy via `vercel` CLI.
    3. Connect GitHub repository for automated CD (Continuous Deployment).
