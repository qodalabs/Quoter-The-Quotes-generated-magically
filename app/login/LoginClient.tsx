"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginClient() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4">
      <div className="rounded-xl bg-black p-6 ambient glow">
        <div className="h-1 w-full rounded bg-gradient-to-r from-emerald-500/60 via-emerald-400 to-emerald-600/60 mb-4" />
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-emerald-400">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <div className="inline-flex rounded-lg border border-emerald-500/30 p-0.5 bg-black">
            <button
              onClick={() => setMode("signin")}
              className={`px-3 py-1 text-sm rounded-md ${mode === "signin" ? "bg-emerald-500 text-gray-900" : "text-emerald-400 hover:bg-emerald-500/10"}`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`px-3 py-1 text-sm rounded-md ${mode === "signup" ? "bg-emerald-500 text-gray-900" : "text-emerald-400 hover:bg-emerald-500/10"}`}
            >
              Sign up
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-emerald-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-emerald-500/40 bg-black px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-emerald-400">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-emerald-500/40 bg-black px-3 py-2 pr-10 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10"
                aria-label="Toggle password visibility"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-gray-900 shadow-[0_8px_40px_rgba(16,185,129,0.15)] hover:bg-emerald-400 hover:shadow-[0_10px_48px_rgba(16,185,129,0.25)] disabled:opacity-70"
          >
            {loading && <span className="spinner" />} {mode === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-400">
          By continuing you agree to the terms of use.
        </p>
      </div>
    </div>
  );
}
