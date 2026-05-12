# Tasks: PR Ideas MVP

## Phase 1: Setup
- [x] T001 Initialize Next.js 16 project with Tailwind CSS
- [x] T002 Install dependencies: prisma, @prisma/client, @prisma/adapter-libsql, @libsql/client, openai, agentmail, zod
- [x] T003 Initialize Prisma with LibSQL adapter (Prisma 7 migration)

## Phase 2: Foundational
- [x] T004 Create Database Schema for Idea and Comment in prisma/schema.prisma
- [x] T005 Push schema to Turso database
- [x] T006 Setup environment variable validation in src/lib/env.ts

## Phase 3: [US1] & [US2] Inbound Router & AI Analysis
- [x] T007 [US2] Implement Inbound Router logic for AgentMail in src/lib/inbound-router.ts
- [x] T008 [US1] Integrate OpenAI Vision for doodle analysis and meta-idea generation
- [x] T009 [US1] Implement "Create Idea" API with Draft status
- [x] T010 [US1] Create script to pull from AgentMail and route to database in scripts/sync-inbound.ts

## Phase 4: [US3] Draft & Edit Workflow
- [x] T011 [US3] Create Secure Admin Dashboard in src/app/admin/page.tsx
- [x] T012 [US3] Implement Status Toggles (Draft, Published, Private) via Admin API
- [x] T013 [US3] Add "Privacy" flag support to database and UI

## Phase 5: [US4] Public Card Gallery
- [x] T014 [US4] Create Card component for ideas in src/app/page.tsx
- [x] T015 [US4] Implement Main Gallery page with grid layout and dynamic force-render
- [x] T016 [US4] Implement detail routing and "View Details" logic
- [x] T017 [US4] Create Idea Detail page in src/app/idea/[id]/page.tsx

## Phase 6: [US5] Engagement & Safety
- [x] T018 [US5] Implement "Like" and "Dislike" API routes
- [x] T019 [US5] Implement Comment submission in src/app/api/idea/[id]/comment/route.ts
- [x] T020 [US5] Add Like/Dislike components and CommentForm to Idea Detail page

## Phase 7: Deployment & Operations
- [x] T021 Configure vercel.json and package.json for build optimizations
- [x] T022 Setup Vercel environment variables (TURSO_DATABASE_URL, OPENAI_API_KEY, ADMIN_SECRET, etc.)
- [x] T023 Deploy to Vercel via GitHub Continuous Integration
- [x] T024 Setup Cron Job for `npm run sync` to pull ideas from email hourly
- [x] T025 Implement automated daily database backups to Google Drive (2:30 AM)
- [x] T026 Integrated Expense tracking from AgentMail to PR Expenses spreadsheet
