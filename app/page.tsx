"use client";

import Link from "next/link";
import HomeLoader from "../components/HomeLoader";
import { useEffect, useMemo, useState } from "react";
import React from 'react'; // Added import for React

// --- START: MISSING DATA DEFINITIONS ---

// Placeholder data for testimonials
const testimonials = [
  { name: "Alex R.", initials: "AR", role: "Developer", stars: 5, quote: "The best tool for generating quick, profound text for placeholders. Saves me hours!" },
  { name: "Sarah M.", initials: "SM", role: "Writer", stars: 5, quote: "I use Quoter for daily inspiration. The author style feature is pure genius." },
  { name: "Ben C.", initials: "BC", role: "Designer", stars: 4, quote: "Sleek UI and fast generation. Highly recommended for any creative project." },
];

// Placeholder data for reviews
const reviews = [
  { id: 1, title: "Fantastic Tool", stars: 5, text: "The integration with Gemini is seamless. I'm amazed at the quality and speed of the quotes.", author: "Jane Doe", date: "Oct 2025" },
  { id: 2, title: "Great Aesthetic", stars: 4, text: "The Petronas Green theme is excellent. Very easy on the eyes for late-night work.", author: "John Smith", date: "Oct 2025" },
];

// --- START: MISSING HELPER COMPONENTS ---

// Star component for ratings
const Star = ({ full }: { full: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={full ? "currentColor" : "none"}
    stroke={full ? "none" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-4 w-4 ${full ? "text-amber-400" : "text-amber-400/50"}`}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// DemoQuote component for a fixed example quote
const DemoQuote = () => (
  <div className="p-4 border border-emerald-500/50 rounded-lg text-center">
    <p className="italic text-lg text-gray-100">
      "The true dashboard of a successful life is not measured in output, but in the quality of the stillness between the actions."
    </p>
    <p className="mt-2 text-sm text-emerald-400">— Elara Vance, Philosophical Futurist</p>
  </div>
);

// --- END: MISSING DEFINITIONS ---


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

  // Scroll-reveal animations for elements with .reveal
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.12 }
    );
    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // The 'return' statement is now correctly inside the HomePage function body.
  return (
    <div className="space-y-12">
      <HomeLoader />
      {/* Hero */}
      <section className="text-center space-y-5">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 mb-3 ml-2 sm:mt-0 sm:mb-2 sm:ml-0">
          Your words, beautifully quoted
        </h1>
        <p className="mx-auto max-w-2xl text-gray-300">
          <span className="text-emerald-400">Quoter</span> crafts short, original quotes with
          a modern, elegant aesthetic powered by Gemini.
        </p>
        <p
          className="mx-auto max-w-3xl text-lg text-gray-200 min-h-[2rem] sm:min-h-[1.75rem] break-words whitespace-normal"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="inline-block border-l-2 border-emerald-500 pl-3 pr-1 text-gray-100">
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

      {/* Highlights */}
      <div className="reveal">
        <h2 className="section-heading mt-4 mb-3 ml-2 sm:mt-0 sm:mb-2 sm:ml-0">Highlights</h2>
        <div className="section-bar my-3" />
      </div>
      {/* Promo panels */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-black p-6 ambient glow glow-hover glow glow-hover reveal">
          <h3 className="mb-2 font-semibold text-emerald-400">Smart Generation</h3>
          <p className="text-sm text-gray-300">
            Fine-tune topic, tone, and author style. Quoter blends them into concise, impactful lines.
          </p>
        </div>
        <div className="rounded-lg bg-black p-6 ambient glow glow-hover glow glow-hover reveal">
          <h3 className="mb-2 font-semibold text-emerald-400">Save & Publish</h3>
          <p className="text-sm text-gray-300">
            Keep your favorites, publish to the collaborative feed, and revisit them anytime.
          </p>
        </div>
        <div className="rounded-lg bg-black p-6 ambient glow glow-hover glow glow-hover reveal">
          <h3 className="mb-2 font-semibold text-emerald-400">Modern Dark UI</h3>
          <p className="text-sm text-gray-300">
            Minimal, refined, and responsive — built with Tailwind and a Petronas‑green accent.
          </p>
        </div>
      </section>

      {/* Demo + Details */}
      <div className="reveal mt-8">
        <h2 className="section-heading mt-4 mb-3 ml-2 sm:mt-0 sm:mb-2 sm:ml-0">Live Demo</h2>
        <div className="section-bar my-3" />
      </div>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-black p-6 ambient glow glow-hover glow glow-hover reveal">
          <h2 className="mb-3 text-lg font-semibold text-emerald-400">Public Demo</h2>
          <p className="text-sm text-gray-300 mb-4">Example of what Quoter can generate.</p>
          <DemoQuote />
        </div>
        <div className="rounded-lg bg-black p-6 ambient glow glow-hover glow glow-hover reveal">
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
      <section className="rounded-lg bg-black p-6 ambient glow glow-hover text-center">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} full />
          ))}
        </div>
        <p className="mt-2 text-gray-200 text-lg font-semibold">4.9 / 5</p>
        <p className="text-sm text-gray-400">Trusted by 120+ creators</p>
      </section>

      {/* Testimonials */}
      <div className="reveal mt-8">
        <h2 className="section-heading mt-4 mb-3 ml-2 sm:mt-0 sm:mb-2 sm:ml-0">Testimonials</h2>
        <div className="section-bar my-3" />
      </div>
      <section className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-lg bg-black p-6 ambient glow glow-hover glow glow-hover reveal">
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
      <div className="reveal mt-8">
        <h2 className="section-heading mt-4 mb-3 ml-2 sm:mt-0 sm:mb-2 sm:ml-0">Reviews</h2>
        <div className="section-bar my-3" />
      </div>
      <section className="grid gap-6 md:grid-cols-2">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-lg bg-black p-6 ambient glow glow-hover glow glow-hover reveal">
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
    </div>
  );
}

