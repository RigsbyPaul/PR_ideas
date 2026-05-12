"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  ideaId: string;
}

export default function CommentForm({ ideaId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/idea/${ideaId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, author: author || "Anonymous" }),
      });
      
      if (res.ok) {
        setContent("");
        setAuthor("");
        router.refresh(); // Refresh to show new comment
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Leave a comment</h3>
      <div>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-sm"
        />
      </div>
      <div>
        <textarea
          placeholder="What do you think about this idea?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-sm resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold rounded-lg transition-colors disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
