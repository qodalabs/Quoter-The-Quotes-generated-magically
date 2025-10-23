"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function HomePage() {
  const messages = useMemo(
    () => [
      "Turn any topic into a memorable quote.",
      "Choose a tone. Pick an author style. Get magic.",
      "Save favorites and share with the world.",
    ],
    []
  );
  const [msgIndex, setMsgIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = messages[msgIndex];
    const typingSpeed = deleting ? 30 : 50;
    const timeout = setTimeout(() => {
      if (!deleting && subIndex < current.length) {
        setSubIndex((s) => s + 1);
      } else if (!deleting && subIndex === current.length) {
        setDeleting(true);
      } else if (deleting && subIndex > 0) {
        setSubIndex((s) => s - 1);
      } else {
        setDeleting(false);
        setMsgIndex((i) => (i + 1) % messages.length);
      }
    }, subIndex === current.length && !deleting ? 1400 : typingSpeed);
    return () => clearTimeout(timeout);
  }, [messages, msgIndex, subIndex, deleting]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center space-y-5">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Your words, beautifully quoted
        </h1>
        <p className="mx-auto max-w-2xl text-gray-300">
          <span className="text-emerald-400">Quoter</span> crafts short, original quotes with
          a modern, elegant aesthetic powered by Gemini.
        </p>
        <p
          className="mx-auto max-w-3xl text-lg text-gray-200 h-8 sm:h-7"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="border-l-2 border-emerald-500 pl-3 text-gray-100">
            {messages[msgIndex].slice(0, subIndex)}
            <span className="ml-1 inline-block h-5 w-[2px] align-middle bg-emerald-400 animate-pulse" />
          </span>
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-emerald-500 px-5 py-2 text-gray-900 font-semibold hover:bg-emerald-400"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-700 px-5 py-2 text-gray-200 hover:border-emerald-500 hover:text-emerald-400"
          >
            Try Dashboard
          </Link>
        </div>
      </section>

      {/* Promo panels */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-gray-800 p-6 ambient">
          <h3 className="mb-2 font-semibold text-emerald-400">Smart Generation</h3>
          <p className="text-sm text-gray-300">
            Fine-tune topic, tone, and author style. Quoter blends them into concise, impactful lines.
          </p>
        </div>
        <div className="rounded-lg bg-gray-800 p-6 ambient">
          <h3 className="mb-2 font-semibold text-emerald-400">Save & Publish</h3>
          <p className="text-sm text-gray-300">
            Keep your favorites, publish to the collaborative feed, and revisit them anytime.
          </p>
        </div>
        <div className="rounded-lg bg-gray-800 p-6 ambient">
          <h3 className="mb-2 font-semibold text-emerald-400">Modern Dark UI</h3>
          <p className="text-sm text-gray-300">
            Minimal, refined, and responsive — built with Tailwind and a Petronas‑green accent.
          </p>
        </div>
      </section>

      {/* Demo + Details */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-6 ambient">
          <h2 className="mb-3 text-lg font-semibold text-emerald-400">Public Demo</h2>
          <p className="text-sm text-gray-300 mb-4">Example of what Quoter can generate.</p>
          <DemoQuote />
        </div>
        <div className="rounded-lg bg-gray-800 p-6 ambient">
          <h2 className="mb-3 text-lg font-semibold text-emerald-400">Built For You</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
            <li>Supabase auth with protected dashboard.</li>
            <li>Gemini‑powered quote generation.</li>
            <li>Publish to a collaborative feed.</li>
            <li>Save and manage your quote history.</li>
          </ul>
        </div>
      </section>

      {/* Ratings */}
      <section className="rounded-lg bg-gray-800 p-6 ambient text-center">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} full />
          ))}
        </div>
        <p className="mt-2 text-gray-200 text-lg font-semibold">4.9 / 5</p>
        <p className="text-sm text-gray-400">Trusted by 120+ creators</p>
      </section>

      {/* Testimonials */}
      <section className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-lg bg-gray-800 p-6 ambient">
            <div className="mb-3 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-100">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
            <div className="mb-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} full={i < t.stars} />
              ))}
            </div>
            <p className="text-sm text-gray-300">“{t.quote}”</p>
          </div>
        ))}
      </section>

      {/* Reviews */}
      <section className="grid gap-6 md:grid-cols-2">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-lg bg-gray-800 p-6 ambient">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-100">{r.title}</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} full={i < r.stars} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-300">{r.text}</p>
            <p className="mt-3 text-xs text-gray-500">— {r.author}, {r.date}</p>
          </div>
        ))}
      </section>


