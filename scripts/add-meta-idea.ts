
import prisma from '../src/lib/prisma';

async function main() {
  const idea = await prisma.idea.create({
    data: {
      title: "PR Ideas",
      description: `Create a tool to help me manage, publicise, critique my ideas. My ideas are in many formats paper doodles, text messages, emails voice notes. Lets call it 'PR Ideas'. I want you to understand, critique and explore the idea. I want anonymous readers of my ideas to be able to 'like' / 'dislike' an idea.`,
      status: "PUBLISHED",
      aiText: `### 🧠 Understanding
The core problem being solved is the **Input Fragmentation**. Ideas are fleeting and often captured in the quickest way possible (a voice memo while driving, a scribble on a napkin, a quick Telegram message). By creating a central repository that handles these disparate formats, you transform a 'junk drawer' of thoughts into a structured innovation pipeline.

### ⚖️ Critique
**Strengths:**
*   **Low-Friction Capture:** By supporting Telegram and Email, you lower the barrier to entry for the 'moment of inspiration'.
*   **Public Accountability:** Having a dashboard makes your progress visible, which can motivate development.
*   **Feedback Loop:** Anonymous 'likes' provide a simple signal of what resonates with others without the social friction of named comments.

**Potential Pitfalls:**
*   **The "Doodle" Problem:** Turning paper sketches into actionable data is hard. We might need a Vision-to-Markdown pipeline.
*   **Over-Engineering:** The risk is spending more time building the tool than the actual ideas it contains.

### 🚀 Exploration
*   **Semantic Linking:** Imagine if the AI says: "Hey, your idea for 'Solar Mugs' from 3 months ago actually solves the power problem for this new 'Remote Sensor' idea."
*   **Voice-to-Task:** Since you use voice notes, the system could automatically generate a Trello board or GitHub Issue from the audio transcript.
*   **Public/Private Toggles:** Some ideas are for the world; some are for your eyes only. Adding a privacy flag would be key.`,
    }
  });
  console.log("Success: Created idea " + idea.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
