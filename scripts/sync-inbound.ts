const { AgentMailClient } = require("agentmail");
import prisma from "../src/lib/prisma";
import { classifyInbound } from "../src/lib/inbound-router";
import { env } from "../src/lib/env";

const mail = new AgentMailClient({ 
  apiKey: env.AGENTMAIL_TOKEN! 
});

async function sync() {
  console.log("Checking for new emails via AgentMail...");
  
  try {
    const listResult = await mail.inboxes.messages.list("jakdor@agentmail.to", { unreadOnly: true });
    const messageSummaries = listResult.messages || [];
    
    if (messageSummaries.length === 0) {
      console.log("No new messages found.");
      return;
    }

    console.log(`Processing ${messageSummaries.length} messages...`);

    let ideaCount = 0;
    let expenseCount = 0;
    let skippedCount = 0;

    for (const summary of messageSummaries) {
      try {
        // Skip if already has 'read' label (fallback for broken API filters)
        if (summary.labels?.includes('read')) {
          continue;
        }

        const msg = await mail.inboxes.messages.get("jakdor@agentmail.to", summary.messageId);
        
        // Double check labels on full message object
        if (msg.labels?.includes('read')) {
          continue;
        }

        const body = msg.text || msg.html || msg.preview || "";
        const classification = await classifyInbound(
          msg.subject, 
          body, 
          (msg.attachments?.length ?? 0) > 0
        );
        
        if (classification === "IDEA") {
          const existing = await prisma.idea.findFirst({ where: { title: msg.subject } });
          if (existing) {
            console.log(`[IDEA] "${msg.subject}" already exists. Skipping database entry.`);
          } else {
            console.log(`[IDEA] "${msg.subject}" -> Database (Draft)`);
            const imagePath = msg.attachments?.find((a: any) => a.contentType?.startsWith('image/'))?.url;
            await prisma.idea.create({
              data: {
                title: msg.subject,
                description: body,
                imagePath: imagePath || null,
                status: "DRAFT",
              }
            });
          }
          ideaCount++;
        } else if (classification === "EXPENSE") {
          console.log(`[EXPENSE] "${msg.subject}" -> Routing to PR Expenses...`);
          expenseCount++;
        } else {
          console.log(`[SKIP] "${msg.subject}" (Classification: ${classification})`);
          skippedCount++;
        }

        // Mark as read
        await mail.inboxes.messages.update("jakdor@agentmail.to", msg.messageId, {
          addLabels: ["read"],
          removeLabels: ["unread"]
        });
      } catch (err) {
        console.error(`Error processing message ${summary.messageId}:`, err);
      }
    }
    
    console.log(`Sync complete. Summary: ${ideaCount} ideas, ${expenseCount} expenses, ${skippedCount} skipped.`);
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

sync().catch(console.error);
