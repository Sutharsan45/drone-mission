import React from "react";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { terrainFeatures, airspaceZones, platforms, missions } from "../data/jammuData";

const modules = [
  { n: 1, title: "Data Integration", obj: "O1", color: "#38bdf8" },
  { n: 2, title: "Platform Performance", obj: "O2", color: "#22c55e" },
  { n: 3, title: "Environmental Risk", obj: "O3", color: "#f59e0b" },
  { n: 4, title: "Constraint Finder", obj: "O4", color: "#a855f7" },
  { n: 5, title: "Feasibility & Route", obj: "O5·O6", color: "#38bdf8" },
  { n: 6, title: "Re-assessment & Record", obj: "O7·O8", color: "#22c55e" },
];

function Ring({ value, max, color, label, sub }) {
  const r = 34, c = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="flex flex-col items-center float-in">
      <div className="relative">
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="5"
                  strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dashoffset 1.4s cubic-bezier(0.65,0,0.35,1)" }} />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-2xl font-black text-white text-glow" style={{ color }}>{value}</div>
        </div>
      </div>
      <div className="mt-2 text-[10px] uppercase font-bold tracking-[0.15em] text-slate-300">{label}</div>
      <div className="text-[9px] text-slate-500 tracking-wider">{sub}</div>
    </div>
  );
}

export default function Overview() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-accent/30 p-10"
           style={{ background: "linear-gradient(120deg, rgba(56,189,248,0.12) 0%, rgba(34,197,94,0.05) 40%, rgba(4,7,13,0.95) 85%)" }}>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/25 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-good/15 blur-[100px]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 reveal">
            <span className="w-2 h-2 rounded-full bg-good pulse-dot" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Mission Control · Jammu</span>
          </div>
          <h1 className="text-5xl font-black leading-[1.05] text-white max-w-3xl reveal">
            Plan every mission
            <br />
            <span className="bg-gradient-to-r from-accent via-good to-accent bg-clip-text text-transparent">
              in one clear decision.
            </span>
          </h1>
          <p className="text-sm text-slate-300 mt-4 max-w-2xl leading-relaxed reveal">
            Terrain · weather · airspace · platform limits → one risk-aware
            <span className="text-accent font-bold"> go / conditional / no-go </span>
            with ranked paths and explained reasons.
          </p>

          <div className="flex gap-3 mt-7 reveal">
            <Link to="/plan" className="group px-6 py-3 rounded-xl bg-accent text-slatebase font-black text-sm hover:bg-accent/90 transition shadow-xl shadow-accent/30 flex items-center gap-2">
              <span>✈</span> Start a Plan
              <span className="group-hover:translate-x-1 transition">→</span>
            </Link>
            <Link to="/terrain" className="px-6 py-3 rounded-xl border border-accent/40 text-accent text-sm font-bold hover:bg-accent/10 transition flex items-center gap-2">
              <span>▲</span> Explore 3D Terrain
            </Link>
          </div>
        </div>
      </div>

      {/* LIVE METRIC RINGS */}
      <div className="glass rounded-2xl p-6 brackets">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Live Sector Metrics</div>
          <div className="text-[10px] text-slate-500 font-mono">JAMMU · LIVE</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Ring value={terrainFeatures.length} max={8} color="#38bdf8" label="Terrain Features" sub="Shivalik · Tawi" />
          <Ring value={airspaceZones.length} max={8} color="#f59e0b" label="Airspace Zones" sub="Red · Yellow · Green" />
          <Ring value={platforms.length} max={4} color="#22c55e" label="Platforms" sub="Fixed & Multi" />
          <Ring value={missions.length} max={4} color="#a855f7" label="Mission Presets" sub="Ready to fly" />
        </div>
      </div>

      {/* MODULES */}
      <Card title="The six modules · Inputs → Decision" subtitle="Figure 1 · Concept">
        <div className="grid md:grid-cols-3 gap-3 mt-3">
          {modules.map((m) => (
            <div key={m.n}
                 className="group relative rounded-xl p-4 border border-white/5 bg-panelLight overflow-hidden glass-hover brackets">
              <div className="absolute inset-x-0 top-0 h-[2px] opacity-70"
                   style={{ background: `linear-gradient(90deg, transparent, ${m.color}, transparent)` }} />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">MODULE {String(m.n).padStart(2, "0")}</div>
                  <div className="text-[12px] font-bold text-white mt-0.5">{m.title}</div>
                </div>
                <span className="text-[9px] px-2 py-1 rounded border font-black tracking-wider"
                      style={{ color: m.color, borderColor: `${m.color}66`, background: `${m.color}15` }}>
                  {m.obj}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* QUICK LAUNCH */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { to: "/terrain", title: "3D Terrain", desc: "Orbit Jammu's Shivalik hills", color: "#38bdf8", icon: "▲" },
          { to: "/plan", title: "Plan Mission", desc: "Full go/no-go engine", color: "#22c55e", icon: "✈" },
          { to: "/risk", title: "Weather Risk", desc: "Scored hazard presets", color: "#f59e0b", icon: "☂" },
        ].map((x) => (
          <Link key={x.to} to={x.to}
                className="glass glass-hover rounded-xl p-5 flex items-center gap-4 group relative overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                 style={{ background: `radial-gradient(circle at 0% 50%, ${x.color}20, transparent 70%)` }} />
            <div className="relative w-14 h-14 rounded-2xl grid place-items-center text-2xl font-black flex-shrink-0"
                 style={{ background: `${x.color}18`, color: x.color, border: `1px solid ${x.color}55`, boxShadow: `0 0 20px ${x.color}30` }}>
              {x.icon}
            </div>
            <div className="relative">
              <div className="text-sm font-black text-white group-hover:text-accent transition flex items-center gap-1">
                {x.title} <span className="group-hover:translate-x-1 transition inline-block">→</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{x.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}