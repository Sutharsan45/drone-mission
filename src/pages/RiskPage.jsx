import React from "react";
import Card from "../components/Card";
import { weatherPresets } from "../data/jammuData";
import { environmentalRisk } from "../utils/engine";

export default function RiskPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Environmental Risk & Weather — Jammu</h1>
      <p className="text-sm text-slate-400">Each preset is scored 0–100 against the platform hard limits. Higher = riskier.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {weatherPresets.map((w) => {
          const r = environmentalRisk(w, 400);
          const color = r.score < 35 ? "text-good" : r.score < 65 ? "text-warn" : "text-bad";
          return (
            <Card key={w.id} title={w.name} subtitle={r.rating}>
              <div className={`text-3xl font-bold ${color}`}>{r.score}<span className="text-xs text-slate-400">/100</span></div>
              <div className="mt-2 h-2 rounded bg-white/10 overflow-hidden">
                <div className={`h-full ${r.score < 35 ? "bg-good" : r.score < 65 ? "bg-warn" : "bg-bad"}`} style={{ width: `${r.score}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] mt-2">
                <div>Temp: {w.temp}°C</div>
                <div>Wind: {w.wind} kt</div>
                <div>Gust: {w.gust} kt</div>
                <div>Rain: {w.rain} mm/h</div>
                <div>Vis: {w.vis} km</div>
              </div>
              {r.hardBreach && <div className="text-bad text-[11px] mt-1">Hard-limit breach detected</div>}
            </Card>
          );
        })}
      </div>

      <Card title="Hazard weights (documented & adjustable)">
        <ul className="text-[11px] space-y-1 mt-1">
          <li>Wind 35% · Gust 25% · Rain 20% · Visibility 20%</li>
          <li>Hard-limit breach always forces <span className="text-bad">no-go</span> for the segment.</li>
          <li>Forecast uncertainty shown as a band; conservative margins by default.</li>
        </ul>
      </Card>
    </div>
  );
}