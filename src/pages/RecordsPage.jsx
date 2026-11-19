import React from "react";
import Card from "../components/Card";
import { historicalMissions } from "../data/jammuData";

export default function RecordsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Mission Records & Validation</h1>
      <p className="text-sm text-slate-400">O8 explains, O10 validates — replayable plans and outcomes for after-action review.</p>

      <Card title="Historical missions (O10 validation set)">
        <table className="w-full text-[11px] mt-2">
          <thead className="text-slate-400 text-left">
            <tr><th className="p-2">ID</th><th>Name</th><th>Route</th><th>Outcome</th><th>Risk</th><th>Duration</th><th>Note</th></tr>
          </thead>
          <tbody>
            {historicalMissions.map((h) => (
              <tr key={h.id} className="border-t border-white/5">
                <td className="p-2 text-accent">{h.id}</td>
                <td>{h.name}</td>
                <td>{h.route}</td>
                <td className={h.outcome === "Completed" ? "text-good" : h.outcome === "Aborted" ? "text-bad" : "text-warn"}>{h.outcome}</td>
                <td>{h.risk}</td>
                <td>{h.duration}</td>
                <td className="text-slate-400">{h.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Record retention">
          <p className="text-[11px] text-slate-300">Full log retained for all missions. Each plan reproducible from stored snapshot: inputs, rule-set version, result.</p>
        </Card>
        <Card title="After-action review">
          <p className="text-[11px] text-slate-300">Exportable report compares predicted risk vs actual outcome; feeds back into model calibration (O2) and thresholds (O3).</p>
        </Card>
      </div>
    </div>
  );
}