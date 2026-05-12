const { AgentMailClient } = require("agentmail");
const client = new AgentMailClient({ apiKey: "am_us_2c3401571a048e8eb41b83b9162b533d16637a8fabb8113fca10f89f0a5653ab" });

async function test() {
  try {
    const result = await client.inboxes.messages.list("jakdor@agentmail.to", { unreadOnly: true });
    if (result.messages && result.messages.length > 0) {
      const msg = result.messages[0];
      console.log("Updating message:", msg.messageId);
      await client.inboxes.messages.update("jakdor@agentmail.to", msg.messageId, {
        labels: { add: ["read"], remove: ["unread"] }
      });
      console.log("Update success");
    } else {
      console.log("No messages to update");
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();
