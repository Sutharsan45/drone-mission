import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Overview", icon: "◎" },
  { to: "/terrain", label: "3D Terrain", icon: "▲" },
  { to: "/plan", label: "Plan", icon: "✈" },
  { to: "/risk", label: "Risk", icon: "☂" },
  { to: "/records", label: "Records", icon: "▤" },
  { to: "/trace", label: "Trace", icon: "⌗" },
];

export default function Shell({ children }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* TOP HUD */}
      <header
        className="sticky top-0 z-50 border-b border-accent/20"
        style={{
          background: "linear-gradient(180deg, rgba(4,7,13,0.98), rgba(4,7,13,0.85))",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* thin accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

        <div className="px-6 py-3 flex items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl grid place-items-center font-black text-lg text-accent bg-gradient-to-br from-accent/30 to-accent/5 border border-accent/60 glow-accent">
              D
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-good pulse-dot shadow-lg shadow-good/50" />
            </div>
            <div>
              <div className="text-[13px] font-black tracking-[0.15em] text-white">DRONE MISSION ASSIST</div>
              <div className="text-[10px] text-accent/90 tracking-[0.2em] uppercase flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent" />
                Jammu Sector · 32.72°N 74.85°E
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex gap-1 ml-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  `group relative px-3.5 py-2 rounded-lg text-[11px] font-bold tracking-wide flex items-center gap-2 transition-all duration-300 ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/50 glow-accent"
                      : "text-slate-400 hover:text-accent hover:bg-accent/8 border border-transparent"
                  }`
                }
              >
                <span className="text-sm">{l.icon}</span>
                {l.label}
                {l.to === "/plan" && (
                  <span className="w-1 h-1 rounded-full bg-good pulse-dot" />
                )}
              </NavLink>
            ))}
          </nav>

          {/* Live telemetry */}
          <div className="ml-auto flex items-center gap-2.5 text-[10px]">
            <div className="px-2.5 py-1.5 rounded-md bg-good/10 border border-good/30 text-good flex items-center gap-1.5 font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-good pulse-dot" />
              OFFLINE · READY
            </div>
            <div className="px-2.5 py-1.5 rounded-md bg-accent/8 border border-accent/25 text-accent font-mono font-bold">
              {now.toLocaleTimeString("en-GB", { hour12: false })}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">{children}</main>

      {/* BOTTOM STATUS STRIP */}
      <footer className="border-t border-accent/15 px-6 py-2 text-[9px] text-slate-500 flex justify-between items-center bg-slatebase/80 tracking-wider">
        <div className="flex items-center gap-4 uppercase">
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-accent" /> Human in control</span>
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-good" /> Explainable</span>
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-warn" /> Offline-first</span>
        </div>
        <div className="font-mono text-accent/60">DATA · 12 NOV 2026 · v1.0</div>
      </footer>
    </div>
  );
}