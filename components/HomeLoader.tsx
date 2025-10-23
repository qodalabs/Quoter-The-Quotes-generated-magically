"use client";

import { useEffect, useState } from "react";

export default function HomeLoader() {
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Only run on the home page and only once per session
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname;
    const already = sessionStorage.getItem("home-loader-shown");
    if (pathname === "/" && !already) {
      setShow(true);
      try {
        document.body.style.overflow = "hidden";
        const boot = document.getElementById("boot-overlay");
        if (boot) boot.remove();
      } catch {}
      // Sequence timing (ms)
      const letterDur = 800; // each letter draw duration
      const totalDraw = letterDur * 6; // 6 letters
      const zoomDelay = totalDraw + 100; // after last letter
      const fadeDelay = zoomDelay + 700; // after zoom/fade

      // attempt a subtle pencil-trace sound during drawing
      try {
        const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AC) {
          const ctx = new AC();
          const duration = (totalDraw + 300) / 1000;
          const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
          const data = buffer.getChannelData(0);
          // white noise with slight variation
          for (let i = 0; i < data.length; i++) {
            // add a slight 1/f flavor
            const n = (Math.random() * 2 - 1 + Math.random() * 0.5) * 0.4;
            data[i] = n;
          }
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          const bp = ctx.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.value = 2200; // pencil scrape region
          bp.Q.value = 0.8;
          const gn = ctx.createGain();
          gn.gain.value = 0.0001;
          src.connect(bp);
          bp.connect(gn);
          gn.connect(ctx.destination);
          const now = ctx.currentTime;
          gn.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
          gn.gain.setTargetAtTime(0.03, now + 0.4, 0.2);
          gn.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.05);
          src.start();
          src.stop(now + duration);
          // close after a little while to free resources
          setTimeout(() => { try { ctx.close(); } catch {} }, (duration + 0.2) * 1000);
        }
      } catch {}

      const t1 = setTimeout(() => {
        // trigger fade out
        setFade(true);
      }, fadeDelay);

      const t2 = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("home-loader-shown", "1");
        try { document.body.style.overflow = ""; } catch {}
      }, fadeDelay + 600);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-[120] flex items-center justify-center bg-black ${fade ? "opacity-0 transition-opacity duration-500" : "opacity-100"}`}>
      <div className="animate-zoom-fade will-change-transform" style={{ animationDelay: "4900ms" }}>
        <SVGWord />
      </div>
    </div>
  );
}

function SVGWord() {
  // Using SVG paths with large dash arrays to simulate drawing
  const common = {
    fill: "none",
    stroke: "#10b981",
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 460 120" className="w-[78vw] max-w-[520px] h-auto overflow-visible">
      <g>
        {/* Q */}
        <path
          {...common}
          className="draw-letter draw-1"
          d="M40,60 a36,36 0 1,1 0.01,0 M60,76 L74,90"
        />
        {/* U */}
        <path
          {...common}
          className="draw-letter draw-2"
          d="M100,32 V70 a22,22 0 0,0 44,0 V32"
        />
        {/* O */}
        <path
          {...common}
          className="draw-letter draw-3"
          d="M196,60 a26,26 0 1,1 0.01,0"
        />
        {/* T */}
        <path
          {...common}
          className="draw-letter draw-4"
          d="M240,32 H304 M272,32 V92"
        />
        {/* E */}
        <path
          {...common}
          className="draw-letter draw-5"
          d="M320,32 V92 M320,32 H360 M320,62 H350 M320,92 H360"
        />
        {/* R */}
        <path
          {...common}
          className="draw-letter draw-6"
          d="M384,92 V32 H412 a16,16 0 1,1 0,32 H384 M400,64 L420,92"
        />
      </g>
    </svg>
  );
}
