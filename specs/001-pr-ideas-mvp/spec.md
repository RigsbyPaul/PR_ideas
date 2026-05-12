# Feature Specification: PR Ideas MVP

## Overview
"PR Ideas" is a platform for Paul Read to share inventions and concepts with the world. It prioritizes a "visual-first" approach where hand-drawn doodles are the primary source of truth, augmented by AI analysis and community feedback.

## User Stories
- **[US1] [P1] Idea Upload & Processing**: As Paul, I want to upload a photo of a doodle or text so that I can quickly share an idea. The system should analyze the image using AI.
- **[US2] [P1] Intelligence Router**: As Paul, I want my forwarded emails (to jakdor@agentmail.to) to be automatically sorted into "Expenses" or "Ideas".
- **[US3] [P2] Draft & Edit Workflow**: As Paul, I want new ideas to stay as "Drafts" while I answer AI-generated clarifying questions before publishing.
- **[US4] [P2] Public Card Gallery**: As a Visitor, I want to see a card-based grid of published ideas with search functionality.
- **[US5] [P3] Engagement & Safety**: As a Visitor, I want to "Like" and comment anonymously on ideas. Comments must be filtered for profanity.

## Functional Requirements
### 1. Intelligence Router
- Automatic classification of inbound emails/files.
- Integration with AgentMail.

### 2. Idea Lifecycle
- Draft -> Questioning -> Published.
- Editable after publication.

### 3. AI Analysis
- Extraction of text and core concepts from doodles.
- Generation of 3 clarifying questions per doodle.

### 4. Public Interface
- Responsive Next.js card gallery.
- Full-text search (metadata + AI extracted text).
- "Like" button and anonymous comments (filtered).

## Review & Acceptance Checklist
- [ ] Inbound router correctly identifies "Expense" vs "Idea".
- [ ] AI extracts text from a sample doodle and asks 3 questions.
- [ ] Idea can be transitioned from Draft to Published.
- [ ] Card gallery displays correctly with search working.
- [ ] Profane comments are blocked.
