
import { createClient } from '@libsql/client';

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    console.log("Adding 'dislikes' column to Idea table...");
    await client.execute("ALTER TABLE Idea ADD COLUMN dislikes INTEGER DEFAULT 0 NOT NULL;");
    console.log("Success!");
  } catch (e: any) {
    if (e.message.includes("duplicate column name")) {
      console.log("Column 'dislikes' already exists.");
    } else {
      console.error("Error adding column:", e.message);
    }
  }

  // Ensure Comment table exists (it was in schema but maybe not pushed to Turso)
  try {
    console.log("Checking Comment table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS Comment (
        id TEXT PRIMARY KEY NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL DEFAULT 'Anonymous',
        ideaId TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ideaId) REFERENCES Idea (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    console.log("Comment table check complete.");
  } catch (e: any) {
    console.error("Error with Comment table:", e.message);
  }

  client.close();
}

main().catch(console.error);
