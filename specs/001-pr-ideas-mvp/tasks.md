# Tasks: PR Ideas MVP

## Phase 1: Setup
- [x] T001 Initialize Next.js 14 project with Tailwind CSS in project root
- [x] T002 Install dependencies: prisma, @prisma/client, openai, agentmail, bad-words
- [x] T003 Initialize Prisma with SQLite provider in prisma/schema.prisma

## Phase 2: Foundational
- [x] T004 Create Database Schema for Idea and Comment in prisma/schema.prisma
- [x] T005 Run prisma migrate dev to initialize database
- [x] T006 Setup environment variable validation in src/lib/env.ts

## Phase 3: [US1] & [US2] Inbound Router & AI Analysis
- [x] T007 [US2] Implement Inbound Router logic for AgentMail in src/lib/inbound-router.ts
- [x] T008 [US1] Integrate OpenAI Vision for doodle analysis in src/lib/ai-vision.ts
- [x] T009 [US1] Implement "Create Idea" API with Draft status in src/app/api/ideas/route.ts
- [x] T010 [US1] Create script to pull from AgentMail and route to database in scripts/sync-inbound.ts

## Phase 4: [US3] Draft & Edit Workflow
- [x] T011 [US3] Create Admin Dashboard for Draft management in src/app/admin/page.tsx
- [x] T012 [US3] Implement "Publish" action and Question answering in src/app/admin/[id]/page.tsx
- [x] T013 [US3] Implement Idea Edit functionality in src/app/admin/[id]/edit/page.tsx

## Phase 5: [US4] Public Card Gallery
- [x] T014 [US4] [P] Create Card component for ideas in src/components/IdeaCard.tsx
- [x] T015 [US4] Implement Main Gallery page with grid layout in src/app/page.tsx
- [x] T016 [US4] Implement Search functionality using Prisma FTS in src/lib/search.ts
- [x] T017 [US4] Create Idea Detail page in src/app/ideas/[id]/page.tsx

## Phase 6: [US5] Engagement & Safety
- [x] T018 [US5] Implement "Like" API with atomic increment in src/app/api/ideas/[id]/like/route.ts
- [x] T019 [US5] Implement Comment submission with profanity filtering in src/app/api/ideas/[id]/comments/route.ts
- [x] T020 [US5] Add Like button and Comment section to Idea Detail page

## Phase 7: Deployment
- [x] T021 Configure vercel.json for deployment
- [ ] T022 [P] Setup Vercel environment variables (OPENAI_API_KEY, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, AGENTMAIL_TOKEN, etc.)
- [ ] T023 Deploy to Vercel via vercel CLI
- [ ] T024 Setup Cron Job for `npm run sync` to pull ideas from email automatically
