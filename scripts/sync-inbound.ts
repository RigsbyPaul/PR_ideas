const { AgentMail } = require("agentmail");
import prisma from "../src/lib/prisma";
import { classifyInbound } from "../src/lib/inbound-router";
import { env } from "../src/lib/env";

// @ts-ignore
const mail = new AgentMail(env.AGENTMAIL_TOKEN!);

async function sync() {
  console.log("Checking for new emails via AgentMail...");
  
  try {
    const messages = await mail.getMessages({ unreadOnly: true });
    
    if (messages.length === 0) {
      console.log("No new messages found.");
      return;
    }

    console.log(`Processing ${messages.length} messages...`);

    for (const msg of messages) {
      const classification = await classifyInbound(
        msg.subject, 
        msg.body, 
        (msg.attachments?.length ?? 0) > 0
      );
      
      if (classification === "IDEA") {
        console.log(`[IDEA] "${msg.subject}" -> Database (Draft)`);
        
        // Take the first image attachment as the doodle if it exists
        const imagePath = msg.attachments?.find((a: any) => a.contentType?.startsWith('image/'))?.url;
        
        await prisma.idea.create({
          data: {
            title: msg.subject,
            description: msg.body,
            imagePath: imagePath || null,
            status: "DRAFT",
          }
        });
      } else if (classification === "EXPENSE") {
        console.log(`[EXPENSE] "${msg.subject}" -> Routing to PR Expenses spreadsheet...`);
        // Note: The pr-expense-tracking skill covers this logic. 
      } else {
        console.log(`[SKIP] "${msg.subject}" (Classification: ${classification})`);
      }

      // Mark message as read so we don't process it again
      await mail.markAsRead(msg.id);
    }
    
    console.log("Sync complete.");
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

sync().catch(console.error);
