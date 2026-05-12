
import prisma from '../src/lib/prisma';

async function main() {
  const idea = await prisma.idea.create({
    data: {
      title: "Privacy Toggles & Draft Mode",
      description: "Implemented a status-based visibility system. Ideas can now be set to DRAFT, PUBLISHED, or PRIVATE. Private ideas will only be visible to the owner via a secure admin view.",
      status: "PUBLISHED",
      aiText: "### Implementation Note\nI have updated the system to recognize 'PRIVATE' as a status. The public dashboard is currently filtered to only show 'PUBLISHED' ideas. Next, we should add an Admin dashboard where Paul can manage these statuses.",
    }
  });
  console.log("Success: Created idea " + idea.id);
}

main().catch(console.error);
