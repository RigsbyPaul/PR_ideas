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

    console.log(`Processing ${messageSummaries.length} unread messages...`);

    let ideaCount = 0;
    let ignoredCount = 0;

    for (const summary of messageSummaries) {
      try {
        if (summary.labels?.includes('read')) {
          continue;
        }

        const msg = await mail.inboxes.messages.get("jakdor@agentmail.to", summary.messageId);
        
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
          console.log(`[IDEA] "${msg.subject}" identified.`);
          const existing = await prisma.idea.findFirst({ where: { title: msg.subject } });
          
          if (existing) {
            console.log(`[IDEA] "${msg.subject}" already exists in DB.`);
          } else {
            console.log(`[IDEA] "${msg.subject}" -> Saving to Database (Draft)`);
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
          
          // ONLY mark as read if it is an IDEA.
          // This allows other project scripts (Health, Expenses) to process the same inbox.
          await mail.inboxes.messages.update("jakdor@agentmail.to", msg.messageId, {
            addLabels: ["read"],
            removeLabels: ["unread"]
          });
          console.log(`[IDEA] "${msg.subject}" marked as read.`);
          ideaCount++;
        } else {
          // If it's an Expense, Health Stat, or anything else, we leave it UNREAD.
          console.log(`[SKIP] "${msg.subject}" (Classification: ${classification}). Leaving unread for other handlers.`);
          ignoredCount++;
        }
      } catch (err) {
        console.error(`Error processing message ${summary.messageId}:`, err);
      }
    }
    
    console.log(`Sync complete. Summary: ${ideaCount} ideas processed and marked read, ${ignoredCount} messages left unread.`);
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

sync().catch(console.error);
