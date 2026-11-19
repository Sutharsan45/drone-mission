import React, { useMemo, useState } from "react";
import { missions, platforms, weatherPresets } from "../data/jammuData";
import { platformPerformance, environmentalRisk, findConstraints, feasibility, buildRoutes, distanceKm } from "../utils/engine";

export default function PlanPage() {
  const [missionId, setMissionId] = useState("M1");
  const [platformId, setPlatformId] = useState("P1");
  const [weatherId, setWeatherId] = useState("W1");

  const mission = missions.find((m) => m.id === missionId);
  const weather = weatherPresets.find((w) => w.id === weatherId);
  const alt = mission.to.elev;
  const dist = distanceKm(mission.from, mission.to);

  const perf = useMemo(() => platformPerformance(platformId, alt, weather.temp, mission.payload), [platformId, alt, weather, mission.payload]);
  const risk = useMemo(() => environmentalRisk(weather, alt), [weather, alt]);
  const constraints = useMemo(() => findConstraints(mission.from, mission.to), [mission]);
  const feas = useMemo(() => feasibility(perf, risk, constraints, mission, dist), [perf, risk, constraints, mission, dist]);
  const routes = useMemo(() => buildRoutes(mission.from, mission.to), [mission]);

  const cfg = feas.result === "GO"
    ? { color: "#22c55e", glow: "glow-good", border: "border-good/50", text: "text-good", label: "GO" }
    : feas.result === "CONDITIONAL"
    ? { color: "#f59e0b", glow: "glow-warn", border: "border-warn/50", text: "text-warn", label: "CONDITIONAL GO" }
    : { color: "#ef4444", glow: "glow-bad", border: "border-bad/50", text: "text-bad", label: "NO-GO" };

  return (
    <div className="p-6 grid lg:grid-cols-12 gap-4 max-w-[1500px] mx-auto">

      {/* LEFT RAIL */}
      <aside className="lg:col-span-3 space-y-3">
        <RailBlock title="01 · Mission">
          <select value={missionId} onChange={(e) => setMissionId(e.target.value)}
                  className="w-full bg-panelLight text-sm rounded-lg p-2.5 border border-white/10 focus:border-accent outline-none text-white font-semibold">
            {missions.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <div className="mt-3 space-y-1.5 text-[11px]">
            <Row k="From" v={mission.from.name} />
            <Row k="To" v={mission.to.name} />
            <Row k="Type" v={mission.type} />
            <Row k="Window" v={mission.window} />
            <Row k="Distance" v={`${dist.toFixed(1)} km`} accent />
            <Row k="Target Alt" v={`${alt} m`} accent />
          </div>
        </RailBlock>

        <RailBlock title="02 · Platform">
          <select value={platformId} onChange={(e) => setPlatformId(e.target.value)}
                  className="w-full bg-panelLight text-sm rounded-lg p-2.5 border border-white/10 focus:border-accent outline-none text-white font-semibold">
            {platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </RailBlock>

        <RailBlock title="03 · Weather">
          <select value={weatherId} onChange={(e) => setWeatherId(e.target.value)}
                  className="w-full bg-panelLight text-sm rounded-lg p-2.5 border border-white/10 focus:border-accent outline-none mb-3 text-white font-semibold">
            {weatherPresets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-1.5">
            <Chip label="Temp" value={`${weather.temp}°C`} />
            <Chip label="Wind" value={`${weather.wind} kt`} />
            <Chip label="Gust" value={`${weather.gust} kt`} />
            <Chip label="Rain" value={`${weather.rain} mm`} />
            <Chip label="Vis" value={`${weather.vis} km`} />
          </div>
        </RailBlock>
      </aside>

      {/* CENTER + RIGHT */}
      <section className="lg:col-span-9 space-y-4">

        {/* VERDICT BANNER */}
        <div className={`relative overflow-hidden rounded-2xl border ${cfg.border} ${cfg.glow} p-7 brackets`}
             style={{ background: `linear-gradient(120deg, ${cfg.color}20, transparent 65%)` }}>
          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full blur-[80px]"
               style={{ background: `${cfg.color}35` }} />
          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-slate-300 font-bold mb-2">Feasibility · O5</div>
              <div className={`text-5xl font-black ${cfg.text} text-glow tracking-tight`}>{cfg.label}</div>
              <div className="mt-4 space-y-1.5 max-w-xl">
                {feas.reasons.map((r, i) => (
                  <div key={i} className="text-[11px] flex items-start gap-2 text-slate-200">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      r.level === "good" ? "bg-good" : r.level === "warn" ? "bg-warn" : "bg-bad"}`} />
                    {r.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] uppercase text-slate-400 tracking-widest">Risk Score</div>
              <div className="text-6xl font-black text-glow" style={{ color: cfg.color }}>{risk.score}</div>
              <div className="text-[10px] uppercase text-slate-400 tracking-widest mt-1">/100 · {risk.rating}</div>
            </div>
          </div>
        </div>

        {/* METRIC GRID */}
        <div className="grid md:grid-cols-3 gap-3">
          <MetricCard title="O2 · Performance">
            <Line k="Endurance" v={`${perf.endurance} min`} />
            <Line k="Range" v={`${perf.range} km`} />
            <Line k="Alt factor" v={perf.altFactor} />
            <Line k="Cold factor" v={perf.coldFactor} />
            <Line k="Payload factor" v={perf.payloadFactor} />
            {perf.warning && <div className="text-warn text-[11px] mt-2 font-bold">⚠ {perf.warning}</div>}
          </MetricCard>

          <MetricCard title="O3 · Hazard Breakdown">
            {Object.entries(risk.breakdown).map(([k, v]) => (
              <div key={k} className="mb-2.5">
                <div className="flex justify-between text-[10px] text-slate-400 capitalize font-bold">
                  <span>{k}</span><span className="text-white">{v}</span>
                </div>
                <div className="h-1.5 rounded bg-white/8 overflow-hidden mt-1">
                  <div className="h-full transition-all duration-700" style={{
                    width: `${v * 100}%`,
                    background: v > 0.66 ? "#ef4444" : v > 0.33 ? "#f59e0b" : "#22c55e",
                    boxShadow: `0 0 8px ${v > 0.66 ? "#ef4444" : v > 0.33 ? "#f59e0b" : "#22c55e"}`
                  }} />
                </div>
              </div>
            ))}
          </MetricCard>

          <MetricCard title="O4 · Constraints">
            {constraints.length === 0 ? (
              <div className="text-[11px] text-good font-bold flex items-center gap-1.5"><span className="text-lg">✔</span> None found</div>
            ) : (
              <ul className="text-[11px] space-y-1.5">
                {constraints.map((c) => (
                  <li key={c.id} className="flex justify-between gap-2">
                    <span className="text-slate-300 truncate">{c.name}</span>
                    <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] uppercase font-black tracking-wider ${
                      c.severity === "hard" ? "bg-bad/20 text-bad" :
                      c.severity === "soft" ? "bg-warn/20 text-warn" : "bg-accent/20 text-accent"}`}>
                      {c.severity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </MetricCard>
        </div>

        {/* ROUTES */}
        <div className="glass rounded-xl p-5 brackets">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-black text-accent tracking-wider uppercase">◈ O6 · Ranked Flight Paths</h3>
            <span className="text-[10px] text-slate-500 font-mono">LOWER RISK FIRST</span>
          </div>
          <div className="space-y-2">
            {routes.map((r, i) => {
              const c = r.riskScore < 40 ? "#22c55e" : r.riskScore < 65 ? "#f59e0b" : "#ef4444";
              return (
                <div key={r.id}
                     className={`rounded-lg p-3 border flex items-center justify-between transition ${i === 0 ? "border-good/40 bg-good/5" : "border-white/5 bg-panelLight hover:border-accent/30"}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg grid place-items-center text-[12px] font-black flex-shrink-0 ${
                      i === 0 ? "bg-good/20 text-good border border-good/50 glow-good" : "bg-white/5 text-slate-400 border border-white/10"
                    }`}>{i + 1}</div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-white">{r.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{r.distance} km · risk {r.riskScore}/100</div>
                    </div>
                  </div>
                  <div className="w-36 h-2 rounded bg-white/10 overflow-hidden flex-shrink-0">
                    <div className="h-full transition-all duration-1000" style={{ width: `${r.riskScore}%`, background: c, boxShadow: `0 0 10px ${c}` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ALERTS */}
        <div className="glass rounded-xl p-5 brackets">
          <h3 className="text-[12px] font-black text-accent tracking-wider uppercase mb-3">◉ O7 / O8 · Alerts & Record</h3>
          <ul className="text-[11px] space-y-2">
            <li className="flex items-center gap-2 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-good pulse-dot" /> Plan accepted · snapshot saved
            </li>
            {weather.rainCell && (
              <li className="flex items-center gap-2 text-warn font-bold">
                <span className="w-2 h-2 rounded-full bg-warn pulse-dot" /> Rain cell near route — re-assess before launch
              </li>
            )}
            {feas.result !== "GO" && (
              <li className="flex items-center gap-2 text-bad font-bold">
                <span className="w-2 h-2 rounded-full bg-bad" /> Reason codes logged for review
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

/* helpers */
function Row({ k, v, accent }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{k}</span>
      <span className={accent ? "text-accent font-black" : "text-slate-200 font-semibold"}>{v}</span>
    </div>
  );
}
function Chip({ label, value }) {
  return (
    <div className="rounded-md bg-panelLight border border-white/5 px-2 py-1.5 hover:border-accent/30 transition">
      <div className="text-[9px] uppercase text-slate-500 tracking-wider">{label}</div>
      <div className="text-accent font-black text-[11px]">{value}</div>
    </div>
  );
}
function Line({ k, v }) {
  return (
    <div className="flex justify-between text-[11px] py-1 border-b border-white/5 last:border-0">
      <span className="text-slate-400">{k}</span>
      <span className="text-white font-bold">{v}</span>
    </div>
  );
}
function MetricCard({ title, children }) {
  return (
    <div className="glass rounded-xl p-4 brackets">
      <div className="text-[11px] font-black text-accent uppercase tracking-wider mb-3">{title}</div>
      {children}
    </div>
  );
}
function RailBlock({ title, children }) {
  return (
    <div className="glass rounded-xl p-4 brackets">
      <div className="text-[10px] font-black text-accent uppercase tracking-[0.15em] mb-2">{title}</div>
      {children}
    </div>
  );
}