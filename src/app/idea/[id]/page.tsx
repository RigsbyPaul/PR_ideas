import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lightbulb, User } from "lucide-react";
import { notFound } from "next/navigation";
import LikeDislike from "@/components/LikeDislike";
import CommentForm from "@/components/CommentForm";

export const dynamic = "force-dynamic";

export default async function IdeaDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!idea) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Ideas</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-1 rounded-lg">
              <Lightbulb className="w-4 h-4 text-zinc-900" />
            </div>
            <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              PR Ideas
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <article className="space-y-8">
          {/* Cover Image */}
          {idea.imagePath && (
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
              <Image
                src={idea.imagePath}
                alt={idea.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Title & Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-xs font-bold uppercase tracking-wider rounded">
                Idea
              </span>
              <time className="text-sm text-zinc-400 dark:text-zinc-500">
                Published on {new Date(idea.createdAt).toLocaleDateString()}
              </time>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
              {idea.title}
            </h1>
            
            <div className="flex items-center justify-between pt-2">
              <LikeDislike 
                ideaId={idea.id} 
                initialLikes={idea.likes} 
                initialDislikes={idea.dislikes} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              <section className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">The Concept</h2>
                <div className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {idea.description}
                </div>
              </section>

              {idea.aiText && (
                <section className="p-8 bg-zinc-900 dark:bg-zinc-900/50 rounded-3xl border border-zinc-800 text-zinc-300">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">AI Analysis & Exploration</h3>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none text-zinc-400 leading-relaxed">
                    {/* Render AI text - assuming simple markdown/text for now */}
                    <div className="whitespace-pre-wrap">{idea.aiText}</div>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar / Comments */}
            <div className="space-y-10">
              <CommentForm ideaId={idea.id} />

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  Conversation
                  <span className="text-sm font-normal text-zinc-400">({idea.comments.length})</span>
                </h3>
                
                {idea.comments.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">No comments yet. Start the discussion!</p>
                ) : (
                  <div className="space-y-6">
                    {idea.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-zinc-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{comment.author}</span>
                            <span className="text-[10px] text-zinc-400 uppercase">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>

      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12 mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} PR Ideas. Built with vision and grit.
          </p>
        </div>
      </footer>
    </div>
  );
}
