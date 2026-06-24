"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Question {
  _id: string;
  title: string;
  authorId?: string;
  authorName?: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface User {
  userId: string;
  username: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOwn, setFilterOwn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // 1. Fetch user session
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));

    // 2. Fetch questions
    fetchQuestions();
  }, [router]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      } else {
        setError("Failed to load questions");
      }
    } catch {
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitLoading(true);
    setError("");

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, isAnonymous }),
      });

      if (res.ok) {
        setNewTitle("");
        fetchQuestions();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post question");
      }
    } catch {
      setError("Failed to post question. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle.trim()) return;
    setError("");

    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditTitle("");
        fetchQuestions();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update question");
      }
    } catch {
      setError("Failed to update question");
    }
  };

  const handleDelete = async (id: string) => {
    setError("");
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeletingId(null);
        fetchQuestions();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete question");
      }
    } catch {
      setError("Failed to delete question");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      router.push("/login");
    } catch {
      setError("Logout failed");
    }
  };

  // Filter and search questions client-side
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOwn = filterOwn ? q.authorId === currentUser?.userId : true;
    return matchesSearch && matchesOwn;
  });

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
        <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-zinc-400 font-semibold tracking-wider animate-pulse">Loading Ask Wall...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Radial ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-500/20">
              A
            </span>
            <span className="text-xl font-bold tracking-tight text-white">Ask Wall</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-zinc-500">Logged in as</span>
              <span className="text-sm font-semibold text-zinc-300">@{currentUser.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm font-medium hover:bg-zinc-800 hover:text-white transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-400/60 hover:text-red-400 font-bold">×</button>
          </div>
        )}

        {/* Input Card */}
        <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl shadow-black/40 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none"></div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            Ask a Question
          </h2>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <textarea
              required
              rows={3}
              placeholder="What would you like to ask on the wall? Keep it constructive..."
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition duration-200 resize-none"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <div className="relative w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                <span className="text-sm font-semibold text-zinc-400 peer-checked:text-zinc-200">
                  Post Anonymously
                </span>
              </label>

              <button
                type="submit"
                disabled={submitLoading || !newTitle.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-40 text-white font-bold py-2.5 px-6 rounded-xl hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all duration-200 text-sm"
              >
                {submitLoading ? "Posting..." : "Post to Wall"}
              </button>
            </div>
          </form>
        </section>

        {/* Filter and Search Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3.5 top-3.5 text-zinc-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>

          <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80 self-start md:self-auto">
            <button
              onClick={() => setFilterOwn(false)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition duration-200 ${
                !filterOwn ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All Questions
            </button>
            <button
              onClick={() => setFilterOwn(true)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition duration-200 ${
                filterOwn ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              My Questions
            </button>
          </div>
        </section>

        {/* Wall of Questions */}
        <section className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-zinc-600 text-sm">No questions found on the wall.</p>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isOwner = q.authorId === currentUser?.userId;
              const isEditing = editingId === q._id;
              const isDeleting = deletingId === q._id;

              return (
                <div
                  key={q._id}
                  className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-800 hover:bg-zinc-900/60 transition duration-200 group flex flex-col justify-between gap-4"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        className="w-full bg-zinc-950 border border-indigo-500/50 rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(q._id)}
                          className="px-3.5 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-white text-base leading-relaxed break-words font-medium">
                          {q.title}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-1 text-xs">
                        <div className="flex items-center gap-2.5 text-zinc-500">
                          {q.isAnonymous ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-400 font-semibold border border-zinc-800">
                              Anonymous
                            </span>
                          ) : (
                            <span className="text-zinc-400 font-medium">
                              @{q.authorName || "unknown"}
                            </span>
                          )}
                          <span>•</span>
                          <span>
                            {new Date(q.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Owner Actions */}
                        {isOwner && !isDeleting && (
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition duration-200">
                            <button
                              onClick={() => {
                                setEditingId(q._id);
                                setEditTitle(q.title);
                              }}
                              className="px-2.5 py-1 rounded bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition duration-150 text-[11px] font-semibold text-zinc-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingId(q._id)}
                              className="px-2.5 py-1 rounded bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition duration-150 text-[11px] font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        )}

                        {/* Delete confirmation state */}
                        {isOwner && isDeleting && (
                          <div className="flex items-center gap-2">
                            <span className="text-red-400 font-medium text-[11px]">Confirm Delete?</span>
                            <button
                              onClick={() => handleDelete(q._id)}
                              className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[10px]"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded text-[10px]"
                            >
                              No
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}