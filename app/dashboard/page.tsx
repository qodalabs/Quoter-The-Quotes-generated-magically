"use client";

import { useEffect, useMemo, useState } from "react";
// Ensure this path is correct for your project structure
import { createClient } from "../../lib/supabase/client"; 
import React from "react"; // Explicitly imported React for full compatibility

type Quote = {
  id: string;
  quote_text: string;
  author: string;
  topic: string | null;
  created_at: string;
  published: boolean;
};

type Profile = {
  user_id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

type Tab = "generate" | "saved" | "profile" | "collab";

// Helper component required by the Profile Settings tab
function AvatarGrid({ selected, onSelect }: { selected: string; onSelect: (u: string) => void }) {
  const AVATARS = [
    "/avatars/a1.svg",
    "/avatars/a2.svg",
    "/avatars/a3.svg",
    "/avatars/a4.svg",
    "/avatars/a5.svg",
    "/avatars/a6.svg",
    "/avatars/a7.svg",
    "/avatars/a8.svg",
  ];
  return (
    <div className="grid grid-cols-4 gap-3">
      {AVATARS.map((src) => (
        <button
          key={src}
          type="button"
          onClick={() => onSelect(src)}
          className={`group relative aspect-square rounded-lg p-1 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/60 ${
            selected === src ? "ring-2 ring-emerald-500/70" : "ring-1 ring-gray-700"
          }`}
        >
          <img src={src} alt="Avatar" className="h-full w-full rounded-md" />
          {selected === src && (
            <span className="pointer-events-none absolute inset-0 rounded-lg shadow-[0_0_24px_rgba(16,185,129,0.35)]" />
          )}
        </button>
      ))}
    </div>
  );
}


export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const [active, setActive] = useState<Tab>("generate");
  // Desktop pinned sidebar open/close
  const [pinnedOpen, setPinnedOpen] = useState(true);
  // Mobile drawer open/close
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Listen for navbar toggle events (mobile only)
  useEffect(() => {
    const handler = () => setDrawerOpen((v) => !v);
    if (typeof window !== "undefined") {
      window.addEventListener("dashboard-sidebar-toggle", handler as EventListener);
      (window as any).toggleDashboardSidebar = handler;
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("dashboard-sidebar-toggle", handler as EventListener);
        try { delete (window as any).toggleDashboardSidebar; } catch (e) { /* noop */ }
      }
    };
  }, []);

  // Generate form state
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Inspirational");
  const [authorStyle, setAuthorStyle] = useState("Maya Angelou");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState<{ quote: string; author: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedVisual, setSavedVisual] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  // Saved quotes
  const [history, setHistory] = useState<Quote[]>([]);

  // Collab feed
  const [feed, setFeed] = useState<Quote[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("quotes")
      .select("id, quote_text, author, topic, created_at, published")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setHistory(data as Quote[]);
  };

  const fetchProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    setUserEmail(userData?.user?.email ?? null);
    if (!uid) return;
    const { data } = await supabase.from("profiles").select("user_id, full_name, bio, avatar_url").eq("user_id", uid).maybeSingle();
    if (data) setProfile(data as Profile);
  };

  const fetchFeed = async () => {
    setFeedLoading(true);
    const { data } = await supabase
      .from("quotes")
      .select("id, quote_text, author, topic, created_at, published")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setFeed(data as Quote[]);
    setFeedLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    fetchProfile();
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generate = async () => {
    setLoading(true);
    setGenerated(null);
    setError(null);
    try {
      const res = await fetch("/api/generate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, authorStyle }),
      });
      if (!res.ok) throw new Error("Failed to generate quote");
      const data = await res.json();
      setGenerated({ quote: data.quote, author: data.author });
      setIsSaved(false);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const saveQuote = async () => {
    if (!generated) return;
    setSaving(true);
    setError(null);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error("Not authenticated");
      }
      const { error } = await supabase.from("quotes").insert({
        quote_text: generated.quote,
        author: generated.author,
        topic: topic || null,
        user_id: userData.user.id,
        published: false,
      });
      if (error) throw error;
      await fetchHistory();
      // Visual + audio feedback
      try {
        const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AC) {
          const ctx = new AC();
          const notes = [784, 988, 1319]; // G5, B5, E6 (bright major chime)
          const start = ctx.currentTime + 0.01;
          notes.forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = "sine";
            o.frequency.value = freq;
            o.connect(g);
            g.connect(ctx.destination);
            const t0 = start + i * 0.12;
            g.gain.setValueAtTime(0.0001, t0);
            g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
            o.start(t0);
            o.stop(t0 + 0.2);
          });
        }
      } catch (e) { /* noop: browser doesn't support AudioContext */ }
      setSavedVisual(true);
      setTimeout(() => setSavedVisual(false), 700);
      setIsSaved(true);
    } catch (e: any) {
      setError(e?.message || "Failed to save quote");
    } finally {
      setSaving(false);
    }
  };

  const publishQuote = async (id: string, publish: boolean) => {
    await supabase.from("quotes").update({ published: publish }).eq("id", id);
    await fetchHistory();
    await fetchFeed();
  };

  const requestUnsave = (id: string) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmUnsave = async () => {
    if (!toDeleteId) return;
    const { error } = await supabase.from("quotes").delete().eq("id", toDeleteId);
    if (!error) {
      // Optimistic update so the card disappears immediately
      setHistory((prev) => prev.filter((q) => q.id !== toDeleteId));
      setConfirmOpen(false);
      setToDeleteId(null);
    } else {
      setError(error.message || "Failed to remove saved quote");
      setConfirmOpen(false);
      setToDeleteId(null);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;
    setProfileSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) return;
    await supabase.from("profiles").upsert({
      user_id: uid,
      full_name: profile.full_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      updated_at: new Date().toISOString(),
    });
    if (password) {
      await supabase.auth.updateUser({ password });
      setPassword("");
    }
    setProfileSaving(false);
  };

  // Sidebar navigation links
  const NavItems = (
    <nav className="space-y-1">
      <div className="mb-3 flex items-center gap-3 rounded-md border border-emerald-500/20 bg-black p-3">
        <img
          src={(profile?.avatar_url || "/avatars/a1.svg") as string}
          alt="Avatar"
          className="h-10 w-10 rounded-full ring-1 ring-emerald-500/30"
        />
        <div>
          <div className="text-sm font-semibold text-emerald-300">
            {profile?.full_name || userEmail?.split("@")[0] || "User"}
          </div>
          <div className="text-xs text-gray-500">Signed in</div>
        </div>
      </div>
      {([
        { key: "generate", label: "Generate Quotes" },
        { key: "saved", label: "Saved Quotes" },
        { key: "collab", label: "Collaborative Space" },
        { key: "profile", label: "Profile Settings" },
      ] as { key: Tab; label: string }[]).map(({ key, label }) => (
        <button
          key={key}
          onClick={() => {
            setActive(key);
            setDrawerOpen(false);
          }}
          className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium border transition-colors ${
            active === key
              ? "border-emerald-500/40 bg-black text-emerald-400"
              : "border-transparent text-gray-300 hover:text-emerald-400 hover:bg-black hover:border-emerald-500/30"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );

  const gridCols = pinnedOpen ? "md:grid-cols-[240px_1fr]" : "md:grid-cols-1";

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className={`grid grid-cols-1 gap-4 px-0 items-start md:items-stretch ${gridCols} min-h-[calc(100vh-7rem)]`}>
      {/* Sidebar - desktop pinned, full-height from header */}
      <aside
        className={`${pinnedOpen ? "md:flex" : "md:hidden"} hidden md:flex-col bg-black border-r border-gray-800/70 px-3 py-3 self-stretch md:min-h-[calc(100vh-7rem)] transition-all duration-300`}
      >
        <div className="md:sticky md:top-0">
          {NavItems}
        </div>
      </aside>

      {/* Content */}
      <section className="space-y-6">
        {/* No desktop toggle here; mobile toggle is in header */}

        {/* Mobile sidebar drawer */}
        {/* Always mounted for smooth transitions, but non-interactive when closed */}
        <div className="fixed inset-0 z-50 md:hidden pointer-events-none">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className={`${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} absolute inset-0 bg-black/60 transition-opacity duration-300 ease-in-out`}
          />
          {/* Drawer */}
          <div
            className={`${drawerOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"} absolute left-0 top-0 h-full w-72 transform bg-black p-4 shadow-2xl ring-1 ring-gray-800 transition-transform duration-300 ease-in-out`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-emerald-400">Navigation</span>
              <button
                aria-label="Close sidebar"
                onClick={() => setDrawerOpen(false)}
                className="group inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-400"
              >
                <span className="relative block h-4 w-5">
                  <span className="absolute left-0 top-0 h-0.5 w-full bg-current translate-y-1.5 rotate-45 transition-transform duration-300"></span>
                  <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-current opacity-0 transition-opacity duration-300"></span>
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-current -translate-y-1.5 -rotate-45 transition-transform duration-300"></span>
                </span>
              </button>
            </div>
            {NavItems}
          </div>
        </div>
        {active === "generate" && (
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="min-w-0 rounded-lg bg-black p-6 ambient glow">
              <h2 className="mb-4 text-lg font-semibold text-emerald-400">Generate a Quote</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-emerald-400">Topic</label>
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., resilience, leadership, focus"
                    className="w-full rounded-lg border border-emerald-500/40 bg-black px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-emerald-400">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-lg border border-emerald-500/40 bg-black px-3 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option>Inspirational</option>
                    <option>Motivational</option>
                    <option>Reflective</option>
                    <option>Playful</option>
                    <option>Stoic</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-emerald-400">Author Style</label>
                  <input
                    value={authorStyle}
                    onChange={(e) => setAuthorStyle(e.target.value)}
                    placeholder="e.g., Maya Angelou, Mark Twain"
                    className="w-full rounded-lg border border-emerald-500/40 bg-black px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={generate}
                  disabled={loading || !topic}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-gray-900 hover:bg-emerald-400 disabled:opacity-70"
                >
                  {loading && <span className="spinner" />} Generate Quote
                </button>
                {error && <p className="text-sm text-red-400">{error}</p>}
              </div>
            </div>

            <div className="min-w-0 rounded-lg bg-black p-6 ambient glow">
              <h2 className="mb-4 text-lg font-semibold text-emerald-400">Generated Quote</h2>
              {generated ? (
                <div className="space-y-4">
                  <blockquote className="rounded-lg border border-emerald-500/30 bg-black p-5 ambient-soft">
                    <p className="text-lg break-words italic text-emerald-300">“{generated.quote}”</p>
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={saveQuote}
                      disabled={saving || isSaved}
                      aria-label="Save quote"
                      title="Save quote"
                      className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-200 disabled:opacity-70 ${
                        isSaved
                          ? "border-emerald-500 bg-emerald-500 text-gray-900"
                          : "border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10"
                      } ${savedVisual ? "pop" : ""}`}
                    >
                      {savedVisual && (
                        <span className="absolute inline-flex h-full w-full rounded-full border-2 border-emerald-400 opacity-75 animate-ping"></span>
                      )}
                      {saving ? (
                        <span className="spinner" />
                      ) : (
                        isSaved ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                            <path fillRule="evenodd" d="M9 12.75l-2.25-2.25a.75.75 0 10-1.06 1.06l2.78 2.78a1.25 1.25 0 001.77 0l6.82-6.82a.75.75 0 10-1.06-1.06L10 12.75z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                            <path d="M6 2.75A1.75 1.75 0 017.75 1h8.5A1.75 1.75 0 0118 2.75v17.19a.75.75 0 01-1.126.65L12 17.21l-4.874 3.38A.75.75 0 016 19.94V2.75z" />
                          </svg>
                        )
                      )}
                    </button>
                    <span className="text-sm text-gray-400">{isSaved ? "Saved" : "Save"}</span>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[220px] items-center justify-center">
                  <span
                    className={`font-quote italic font-bold inline-block whitespace-nowrap px-4 py-3 leading-[1.2] text-5xl md:text-6xl tracking-tight ${
                      loading
                        ? "shimmer-emerald drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                        : "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]"
                    }`}
                  >
                    Quoter
                  </span>
                </div>
              )}
            </div>
            </div>
          </div>
        )}

        {active === "saved" && (
          <div className="space-y-4 px-4 md:px-0">
            <h2 className="text-lg font-semibold text-emerald-400">Saved Quotes</h2>
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm">You haven’t saved any quotes yet.</p>
            ) : (
              <ul className="mx-auto max-w-6xl grid grid-cols-1 gap-5 md:grid-cols-2 px-4 md:px-0">
                {history.map((q) => (
                  <li key={q.id} className="rounded-lg border border-emerald-500/30 bg-black p-5 ambient-soft">
                    <p className="italic text-emerald-300">“{q.quote_text}”</p>
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                      {false && q.topic && <span className="rounded bg-gray-900 px-2 py-0.5 text-gray-300">{q.topic}</span>}
                      <div className="flex items-center gap-2">
                        {!q.published ? (
                          <button
                            onClick={() => publishQuote(q.id, true)}
                            className="rounded border border-emerald-500/60 px-2 py-1 text-emerald-400 hover:bg-emerald-500/10"
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => publishQuote(q.id, false)}
                            className="rounded border border-gray-600 px-2 py-1 text-gray-300 hover:bg-gray-700/50"
                          >
                            Unpublish
                          </button>
                        )}
                        <button
                          onClick={() => requestUnsave(q.id)}
                          className="rounded border border-emerald-500/60 px-2 py-1 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        >
                          Unsave
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {active === "collab" && (
          <div className="space-y-4 px-4 md:px-0">
            <h2 className="text-lg font-semibold text-emerald-400">Collaborative Space</h2>
            <p className="text-gray-400 text-sm">Published quotes from everyone.</p>
            {feedLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-300"><span className="spinner" /> Loading…</div>
            ) : feed.length === 0 ? (
              <p className="text-gray-400 text-sm">No published quotes yet.</p>
            ) : (
              <ul className="mx-auto max-w-6xl grid grid-cols-1 gap-5 md:grid-cols-2 px-4 md:px-0">
                {feed.map((q) => (
                  <li key={q.id} className="rounded-lg border border-emerald-500/30 bg-black p-5 ambient-soft">
                    <p className="italic text-emerald-300">“{q.quote_text}”</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      {false && q.topic && <span className="rounded bg-gray-900 px-2 py-0.5 text-gray-300">{q.topic}</span>}
                      <span>{new Date(q.created_at).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {active === "profile" && (
          <div className="space-y-4 px-4 md:px-0">
            <h2 className="text-lg font-semibold text-emerald-400">Profile Settings</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-black p-6 ambient glow space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-emerald-400">Full Name</label>
                  <input
                    value={profile?.full_name ?? ""}
                    onChange={(e) => setProfile({ ...(profile ?? ({} as Profile)), full_name: e.target.value })}
                    className="w-full rounded-lg border border-emerald-500/40 bg-black px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="Your display name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-emerald-400">Bio</label>
                  <textarea
                    value={profile?.bio ?? ""}
                    onChange={(e) => setProfile({ ...(profile ?? ({} as Profile)), bio: e.target.value })}
                    className="w-full rounded-lg border border-emerald-500/40 bg-black px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                    rows={4}
                    placeholder="A short bio about you"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-emerald-400">Select Avatar</label>
                  <AvatarGrid
                    selected={profile?.avatar_url || "/avatars/a1.svg"}
                    onSelect={(url) => setProfile({ ...(profile ?? ({} as Profile)), avatar_url: url })}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-black p-6 ambient glow space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-emerald-400">Change Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full rounded-lg border border-emerald-500/40 bg-black px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={saveProfile}
                  disabled={profileSaving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-gray-900 hover:bg-emerald-400 disabled:opacity-70"
                >
                  {profileSaving && <span className="spinner" />} Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70" onClick={() => setConfirmOpen(false)} />
            <div className="relative w-full max-w-sm rounded-lg border border-emerald-500/40 bg-black p-6 ambient glow">
              <h3 className="mb-1 text-emerald-400 font-semibold">Remove saved quote?</h3>
              <p className="mb-4 text-sm text-gray-300">This action removes the quote from your saved list.</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="rounded border border-gray-600 px-3 py-1.5 text-gray-300 hover:bg-gray-700/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUnsave}
                  className="rounded border border-emerald-500/60 px-3 py-1.5 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                >
                  Unsave
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
