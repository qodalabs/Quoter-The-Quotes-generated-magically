import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import NavBar from "../components/NavBar";
import Spotlight from "../components/Spotlight";
import { Great_Vibes } from "next/font/google";

const scriptFont = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-script" });

export const metadata: Metadata = {
  title: "Quoter",
  description: "Generate personalized, themed quotes with Gemini",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={scriptFont.variable}>
      <head>
        {/* Inject a tiny boot overlay before hydration to prevent initial flicker on home */}
        <script dangerouslySetInnerHTML={{__html:`(function(){try{var p=location.pathname;if(p==='/'&&!sessionStorage.getItem('home-loader-shown')){var o=document.createElement('div');o.id='boot-overlay';o.style.position='fixed';o.style.inset='0';o.style.background='#000';o.style.zIndex='99999';document.documentElement.classList.add('booting');document.body&&document.body.appendChild(o);} }catch(e){}})();`}} />
      </head>
      <body className="min-h-screen bg-black text-gray-100 overflow-x-hidden">
        <Spotlight />
        <header className="relative z-50 border-b border-gray-800 bg-black md:bg-black/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-300">
              Quoter
            </Link>
            <NavBar />
          </div>
        </header>
        <main className="relative z-10 mx-auto max-w-6xl px-2 sm:px-4 pt-4 pb-6">{children}</main>
        <footer className="relative z-10 mt-6">
          <div className="h-px w-full bg-gradient-to-r from-emerald-500/40 via-emerald-300/20 to-emerald-500/40" />
          <div className="px-4 py-3 text-center text-[11px] text-gray-400">
            Built with Next.js, Supabase, and Gemini
          </div>
        </footer>
      </body>
    </html>
  );
}
