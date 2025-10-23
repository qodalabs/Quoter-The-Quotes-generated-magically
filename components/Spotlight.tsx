"use client";

import { useEffect, useRef, useState } from "react";

export default function Spotlight() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const update = (clientX: number, clientY: number) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setPos({ x: clientX, y: clientY }));
    };

    const onMouse = (e: MouseEvent) => update(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        update(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    // Initialize to center
    update(window.innerWidth / 2, window.innerHeight / 2);

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse as any);
      window.removeEventListener("touchmove", onTouch as any);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const size = 600; // px diameter of glow focal area
  const style: React.CSSProperties = {
    background: `radial-gradient(${size}px at ${pos.x}px ${pos.y}px, rgba(16,185,129,0.18), rgba(16,185,129,0.10) 30%, rgba(17,24,39,0.0) 70%)`,
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-100 ease-out"
      style={style}
    />
  );
}

