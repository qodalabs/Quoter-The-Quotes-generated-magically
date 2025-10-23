"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [hasSession, setHasSession] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setHasSession(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Prevent background scroll when the mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <nav className="relative">
      {/* Desktop */}
      <div className="hidden sm:flex items-center gap-4">
        <Link href="/about" className="text-gray-300 hover:text-emerald-400">
          About
        </Link>
        <Link href="/dashboard" className="text-gray-300 hover:text-emerald-400">
          Dashboard
        </Link>
        {!hasSession ? (
          <Link
            href="/login"
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-emerald-400"
          >
            Get Started
          </Link>
        ) : (
        <button
          onClick={logout}
          className="rounded-lg border border-emerald-500/60 px-3 py-1.5 text-sm font-medium text-emerald-400 transition-all duration-200 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-400/80 hover:shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
        >
          Logout
        </button>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center">
        {/* One mobile icon. On /dashboard it toggles the sidebar; elsewhere it opens site menu. */}
        <button
          aria-label={pathname?.startsWith("/dashboard") ? "Toggle sidebar" : "Open menu"}
          onClick={() => {
            if (pathname?.startsWith("/dashboard")) {
              if (typeof window !== "undefined") {
                // Prefer direct function if available; fallback to custom event
                if ((window as any).toggleDashboardSidebar) {
                  (window as any).toggleDashboardSidebar();
                } else {
                  window.dispatchEvent(new CustomEvent("dashboard-sidebar-toggle"));
                }
              }
            } else {
              setOpen((v) => !v);
            }
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-700 bg-gray-900 text-gray-200 hover:border-emerald-500 hover:text-emerald-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M3.75 6.75A.75.75 0 014.5 6h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm.75 4.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15z" clipRule="evenodd"/>
          </svg>
        </button>
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setOpen(false)}
            />
            {/* Panel */}
            <div className="absolute left-0 right-0 top-0 rounded-b-lg border-b border-emerald-500/20 bg-black p-3 shadow-2xl">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-emerald-400">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.585l4.714 4.715a.75.75 0 11-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 11-1.06-1.06l4.714-4.715-4.714-4.714a.75.75 0 010-1.06z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
              <div className="space-y-1">
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className="block rounded px-3 py-2 text-gray-200 hover:bg-gray-800 hover:text-emerald-400"
                >
                  About
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block rounded px-3 py-2 text-gray-200 hover:bg-gray-800 hover:text-emerald-400"
                >
                  Dashboard
                </Link>
                {!hasSession ? (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="mt-1 block rounded bg-emerald-500 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-emerald-400"
                  >
                    Get Started
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="mt-1 block w-full rounded border border-emerald-500/60 px-3 py-2 text-left text-sm font-medium text-emerald-400 transition-all duration-200 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-400/80 hover:shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
