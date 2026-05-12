"use client";

import { useEffect, useState } from "react";
import { Lock, Globe, FileText, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface Idea {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  _count: {
    comments: number;
  };
}

export default function AdminPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [secret, setSecret] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const fetchIdeas = async (authSecret: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ideas?secret=${authSecret}`);
      if (res.ok) {
        const data = await res.json();
        setIdeas(data);
        setAuthorized(true);
        localStorage.setItem("pr_ideas_admin_secret", authSecret);
      } else {
        alert("Unauthorized or error fetching ideas");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedSecret = localStorage.getItem("pr_ideas_admin_secret");
    if (savedSecret) {
      setSecret(savedSecret);
      fetchIdeas(savedSecret);
    } else {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/ideas?secret=${secret}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setIdeas(ideas.map(i => i.id === id ? { ...i, status: newStatus } : i));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!authorized && !loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-50">Admin Access</h1>
            <p className="text-zinc-400 mt-2">Enter your admin secret to manage ideas.</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Admin Secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border-none focus:ring-2 focus:ring-yellow-400 text-zinc-50 outline-none"
            />
            <button
              onClick={() => fetchIdeas(secret)}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold rounded-xl transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg">Idea Management</h1>
          </div>
          <button 
            onClick={() => fetchIdeas(secret)}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {ideas.map((idea) => (
                  <tr key={idea.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 dark:text-zinc-50">{idea.title}</div>
                      <div className="text-xs text-zinc-500">{idea._count.comments} comments</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        idea.status === "PUBLISHED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500" :
                        idea.status === "PRIVATE" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-500" :
                        "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}>
                        {idea.status === "PUBLISHED" ? <Globe className="w-3 h-3" /> :
                         idea.status === "PRIVATE" ? <Lock className="w-3 h-3" /> :
                         <FileText className="w-3 h-3" />}
                        {idea.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {updatingId === idea.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                        ) : (
                          <select 
                            value={idea.status}
                            onChange={(e) => updateStatus(idea.id, e.target.value)}
                            className="text-xs bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg py-1 pl-2 pr-8 focus:ring-2 focus:ring-yellow-400 outline-none"
                          >
                            <option value="DRAFT">DRAFT</option>
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="PRIVATE">PRIVATE</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
