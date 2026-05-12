# Feature Specification: PR Ideas MVP

## Overview
"PR Ideas" is a platform for Paul Read to share inventions and concepts with the world. It prioritizes a "visual-first" approach where hand-drawn doodles are the primary source of truth, augmented by AI analysis and community feedback.

## User Stories
- **As Paul**, I want to upload a photo of a doodle so that I can quickly share an idea without typing everything out.
- **As Paul**, I want the system to analyze my doodle and ask clarifying questions so that the idea is fully fleshed out for the public.
- **As Paul**, I want to be able to submit ideas via text-only or forwarded emails for convenience.
- **As Paul**, I want to edit my ideas after they are live in case I didn't have time to refine them during upload.
- **As Paul**, I want to toggle my ideas between Public and Private so that I can control my brainstorms.
- **As a Visitor**, I want to see a card-based view of ideas so that I can quickly browse through Paul's inventions.
- **As a Visitor**, I want to 'like' or 'dislike' an idea so that I can provide quick feedback.
- **As a Visitor**, I want to comment anonymously (initially) so that I can provide instant feedback without friction.
- **As the Platform**, I want to back up my data daily to Google Drive so that I never lose my work.
- **As the Platform**, I want to filter profanities in comments to maintain the professional and creative "constitution" of the site.

## Functional Requirements

### 1. Intelligence Router (Inbound Processing)
- **Unified Intake**: Process all incoming communications (Email, Images, Text).
- **Auto-Classification**: 
    - **Expenses**: Detect bank statements, receipts, or financial mentions. Route to the existing 'PR Expenses' workflow (appending to 'Monthly Expenditure').
    - **Ideas**: Detect doodles, invention descriptions, or "Idea:" keywords. Route to 'PR_ideas'.
    - **Other**: Log as general notes or health stats if relevant (e.g., 'PR Health Stats').

### 2. Idea Submission & Processing
- **Multi-modal Input**: Support image (JPEG/PNG), plain text, and email forwarding via **jakdor@agentmail.to**.
- **Lifecycle Management**: 
    - Ideas start as **Drafts**. 
    - AI performs analysis and asks questions while in Draft.
    - User explicitly triggers "Publish" to go live.
    - "Published" ideas remain editable.
- **AI Analysis Engine**: 
    - Automatically extract text and concepts from uploaded doodles.
    - Generate a "Clarification Request" if the system detects ambiguous parts of the image.

### 3. Public Interface
- **Card-based Gallery**: A responsive grid view showing a thumbnail (image or text snippet), title, and comment count.
- **Search functionality**: Full-text search across titles, descriptions, and AI-extracted text.
- **Engagement**:
    - **Interactions**: Interactive "Like" and "Dislike" buttons for visitors with real-time updates.
    - **Comments**: Anonymous text comments with profanity filtering.
- **Idea Detail Page**: Displays the original doodle, the refined description, AI analysis, and the full comment thread.
- **Admin Management**: 
    - **Secure Dashboard**: A private `/admin` area protected by a secret key.
    - **Status Toggles**: Toggle ideas between `DRAFT`, `PUBLISHED`, and `PRIVATE`.
- **Data Integrity**:
    - **Daily Backups**: Automated snapshot of the Turso database uploaded to Google Drive at 2:30 AM.
    - **Smart Snapshots**: Only uploads if changes are detected since the last run.
    - **Retention**: Keeps the last 3 versions automatically.
- **Intelligence Router (Financial)**:
    - Automatically parse receipts and invoices from AgentMail.
    - Append transactions to the 'PR Expenses' Google Sheet with a calculated 'Monthly Expenditure' running total.

## Engagement & Safety
- **Anonymous Commenting**: No login required for visitors initially.
- **Profanity Filter**: Automatic moderation of comments using a standard blacklist.
- **Access Control**: Administrative actions (deleting/toggling) restricted to the secure Admin Secret.

## Review & Acceptance Checklist
- [x] Folder renamed to `PR_ideas` and all script paths updated.
- [x] System successfully extracts text/concepts from a sample doodle.
- [x] User can toggle ideas to `PRIVATE` and see them disappear from public view.
- [x] Like/Dislike buttons update counts in the database without page refresh.
- [x] Daily backup folder `PR_Ideas_Backups` appears in Google Drive.
- [x] Admin dashboard requires a secret key for access.
- [x] Inbound expenses are appended correctly to the 'PR Expenses' spreadsheet.

## Technical Notes (Draft for Plan Phase)
- Cloud storage for images (e.g., S3 or local storage for MVP).
- Search indexing (e.g., SQLite FTS5 or simple memory index).
- AI Vision integration for doodle analysis.
