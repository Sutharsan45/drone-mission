import React from "react";
import Card from "../components/Card";
import { traceability } from "../data/jammuData";

export default function TracePage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Appendix A · Traceability Matrix</h1>
      <p className="text-sm text-slate-400">Every objective (O1–O10) mapped to module, requirement, test and problem gap.</p>
      <Card title="O → Module → Requirement → Test">
        <table className="w-full text-[11px] mt-2">
          <thead className="text-slate-400 text-left">
            <tr><th className="p-2">Objective</th><th>Module</th><th>Requirements</th><th>Test</th><th>Gap</th></tr>
          </thead>
          <tbody>
            {traceability.map((t) => (
              <tr key={t.obj} className="border-t border-white/5">
                <td className="p-2 text-accent">{t.obj}</td>
                <td>{t.module}</td>
                <td>{t.req}</td>
                <td>{t.test}</td>
                <td className="text-slate-400">{t.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card title="Appendix B · Items to confirm">
        <ul className="text-[11px] text-slate-300 space-y-1 mt-1">
          <li>[ ] Platform classes & models for Jammu sector</li>
          <li>[ ] Pilot regions beyond Jammu (Ladakh, Arunachal)</li>
          <li>[ ] Target performance accuracy %</li>
          <li>[ ] Airspace data refresh cadence</li>
          <li>[ ] Waypoint export formats</li>
          <li>[ ] Number of validation regions & altitudes</li>
        </ul>
      </Card>
    </div>
  );
}