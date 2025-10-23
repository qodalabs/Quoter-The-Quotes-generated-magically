export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 space-y-10">
      {/* Hero */}
      <header className="space-y-3">
        <h1 className="section-heading mt-4 mb-3 ml-2 sm:mt-0 sm:mb-2 sm:ml-0">About Quoter</h1>
        <div className="section-bar" />
        <p className="text-gray-300 max-w-3xl">
          Quoter helps you turn ideas into short, original quotes with a refined dark UI and
          Petronas‑green accents. Built for clarity and speed, it pairs a clean authoring
          experience with reliable storage.
        </p>
      </header>

      {/* Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-black p-6 ambient glow">
          <h3 className="mb-2 text-lg font-semibold text-emerald-400">Philosophy</h3>
          <p className="text-sm text-gray-300">
            Fast, elegant, and focused. Every screen emphasizes content and keeps distractions
            at bay so your words stand out.
          </p>
        </div>
        <div className="rounded-lg bg-black p-6 ambient glow">
          <h3 className="mb-2 text-lg font-semibold text-emerald-400">Security</h3>
          <p className="text-sm text-gray-300">
            Supabase Auth guards access; RLS ensures each quote belongs only to its owner. No public
            data is exposed without your action.
          </p>
        </div>
        <div className="rounded-lg bg-black p-6 ambient glow">
          <h3 className="mb-2 text-lg font-semibold text-emerald-400">Performance</h3>
          <p className="text-sm text-gray-300">
            Modern Next.js patterns, SSR‑aware Supabase client, and lightweight styling deliver a
            responsive experience on every device.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="section-heading mt-4 mb-3 ml-2 sm:mt-0 sm:mb-2 sm:ml-0">How It Works</h2>
        <div className="section-bar" />
        <ol className="grid gap-4 md:grid-cols-3 text-gray-300">
          <li className="rounded-lg bg-black p-5 ambient-soft border border-emerald-500/30">
            <p className="text-emerald-400 font-semibold">1. Pick a style</p>
            <p className="text-sm">Choose topic, tone, and an author vibe.</p>
          </li>
          <li className="rounded-lg bg-black p-5 ambient-soft border border-emerald-500/30">
            <p className="text-emerald-400 font-semibold">2. Generate</p>
            <p className="text-sm">Gemini crafts an original line; you can iterate instantly.</p>
          </li>
          <li className="rounded-lg bg-black p-5 ambient-soft border border-emerald-500/30">
            <p className="text-emerald-400 font-semibold">3. Save or publish</p>
            <p className="text-sm">Keep your favorites private or share them to the collab feed.</p>
          </li>
        </ol>
      </section>

      {/* Stack */}
      <section className="space-y-4">
        <h2 className="section-heading mt-4 mb-3 ml-2 sm:mt-0 sm:mb-2 sm:ml-0">Tech Stack</h2>
        <div className="section-bar" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-black p-6 ambient">
            <h3 className="mb-2 text-lg font-semibold text-emerald-400">Core</h3>
            <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
              <li>Next.js 14 (App Router) + TypeScript</li>
              <li>Tailwind CSS for the minimalist dark UI</li>
              <li>Supabase (Auth, Postgres, RLS) for auth + storage</li>
              <li>Google Gemini for quote generation</li>
            </ul>
          </div>
          <div className="rounded-lg bg-black p-6 ambient">
            <h3 className="mb-2 text-lg font-semibold text-emerald-400">Design System</h3>
            <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
              <li>Petronas‑green accents on a deep black canvas</li>
              <li>Rounded corners, ambient glows, balanced spacing</li>
              <li>Responsive grid layouts for every screen size</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="space-y-4">
        <h2 className="section-heading mt-4 mb-3 ml-2 sm:mt-0 sm:mb-2 sm:ml-0">Roadmap</h2>
        <div className="section-bar" />
        <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
          <li>Quote collections and tags</li>
          <li>Export/share as images with brand styling</li>
          <li>More collaborative curation tools</li>
        </ul>
      </section>

      {/* Contact */}
      <section className="space-y-3">
        <h2 className="section-heading mt-4 mb-3 ml-2 sm:mt-0 sm:mb-2 sm:ml-0">Contact</h2>
        <div className="section-bar" />
        <p className="text-gray-300">
          Have feedback or ideas? Open an issue, or reach out from the dashboard.
        </p>
      </section>
    </div>
  );
}
