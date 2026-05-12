import prisma from "@/lib/prisma";
import Image from "next/image";
import { Lightbulb, MessageSquare, ThumbsUp, AlertCircle } from "lucide-react";
import { Idea } from "@prisma/client";

export const dynamic = "force-dynamic";

interface IdeaWithCount extends Idea {
  _count: {
    comments: number;
  };
}

export default async function Home() {
  let ideas: IdeaWithCount[] = [];
  let error: string | null = null;
  
  // Collect environment info safely for debugging
  const dbUrl = process.env.TURSO_DATABASE_URL || "";
  const dbToken = process.env.TURSO_AUTH_TOKEN || "";
  
  let debugInfo = {
    hasUrl: dbUrl.length > 0 && dbUrl !== "undefined",
    hasToken: dbToken.length > 0 && dbToken !== "undefined",
    urlValue: dbUrl.substring(0, 15) + "...",
    isUrlLiteralUndefined: dbUrl === "undefined",
  };

  try {
    if (!debugInfo.hasUrl || !debugInfo.hasToken) {
      const missing = [];
      if (!debugInfo.hasUrl) missing.push(debugInfo.isUrlLiteralUndefined ? "TURSO_DATABASE_URL (is literal 'undefined')" : "TURSO_DATABASE_URL");
      if (!debugInfo.hasToken) missing.push(dbToken === "undefined" ? "TURSO_AUTH_TOKEN (is literal 'undefined')" : "TURSO_AUTH_TOKEN");
      throw new Error(`Environment Variables Issue: ${missing.join(", ")}`);
    }
    
    const results = await prisma.idea.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });
    ideas = results as IdeaWithCount[];
  } catch (e: any) {
    console.error("Database error details:", e);
    error = e.message || "Could not connect to the database.";
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-1.5 rounded-lg">
              <Lightbulb className="w-5 h-5 text-zinc-900" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              PR Ideas
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              by Paul Read
            </span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
            Inventions & Concepts
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            A visual-first collection of doodles, sketches, and creative thoughts, 
            shared to spark conversation and future builds.
          </p>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-16 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30">
            <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-red-900 dark:text-red-50">Database Connection Issue</h3>
            <p className="text-red-600 dark:text-red-400 mt-2 text-center max-w-md px-4 font-mono text-sm">
              {error}
            </p>
            <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-xl text-xs font-mono text-zinc-500 text-left w-full max-w-md">
              <p className="font-bold mb-1">System Check (Runtime):</p>
              <p>TURSO_DATABASE_URL: {debugInfo.hasUrl ? "✅ OK" : debugInfo.isUrlLiteralUndefined ? "❌ Literal 'undefined' string" : "❌ Empty"}</p>
              <p>TURSO_AUTH_TOKEN: {debugInfo.hasToken ? "✅ OK" : "❌ Missing"}</p>
              <p>URL Preview: {debugInfo.urlValue}</p>
            </div>
            <p className="text-xs text-zinc-400 mt-6 italic text-center px-8">
              Check Vercel Dashboard {">"} Settings {">"} Environment Variables. 
              Ensure no quotes or extra spaces. Trigger a new deployment after changes.
            </p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <Lightbulb className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No ideas published yet</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Check back soon for Paul's latest doodles!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <article 
                key={idea.id}
                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all"
              >
                {idea.imagePath && (
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={idea.imagePath}
                      alt={idea.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-xs font-bold uppercase tracking-wider rounded">
                      Idea
                    </span>
                    <time className="text-xs text-zinc-400 dark:text-zinc-500">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 leading-tight">
                    {idea.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6 leading-relaxed">
                    {idea.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{idea.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">{idea._count.comments}</span>
                      </div>
                    </div>
                    <button className="text-sm font-bold text-zinc-900 dark:text-zinc-50 hover:underline underline-offset-4">
                      View details →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} PR Ideas. Built with vision and grit.
          </p>
          <div className="flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Twitter</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">LinkedIn</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Portfolio</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
