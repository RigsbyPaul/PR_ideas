import prisma from "./src/lib/prisma";

async function test() {
  try {
    const res = await prisma.idea.create({
      data: {
        title: "Test Idea",
        description: "Test Description",
        status: "DRAFT"
      }
    });
    console.log("Success! Created idea with ID:", res.id);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
