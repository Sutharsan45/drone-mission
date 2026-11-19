import React, { useState } from "react";
import Terrain3D from "../components/Terrain3D";
import { terrainFeatures, launchSites, airspaceZones } from "../data/jammuData";

export default function TerrainPage() {
  const [tab, setTab] = useState("peaks");

  return (
    <div className="h-[calc(100vh-118px)] flex relative">
      <div className="flex-1 relative">
        <Terrain3D />

        <div className="absolute top-4 left-4 glass rounded-xl px-4 py-3 border-accent/30 glow-accent brackets">
          <div className="text-[9px] uppercase tracking-[0.3em] text-accent font-bold">Sector</div>
          <div className="text-sm font-black text-white">Jammu · 3D Terrain</div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">ORBIT · PAN · AUTO-ROTATE</div>
        </div>

        <div className="absolute bottom-4 left-4 glass rounded-xl p-3 text-[10px] space-y-2 brackets">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-good glow-good" /> Launch site</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-bad glow-bad" /> High terrain (&gt;900m)</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-warn glow-warn" /> Drone (live)</div>
        </div>

        <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-[10px] font-mono text-accent border-accent/25 brackets">
          32.7266°N · 74.8570°E
        </div>
      </div>

      <aside className="w-80 border-l border-accent/15 p-4 space-y-3 overflow-y-auto bg-slatebase/70 backdrop-blur">
        <div className="flex gap-1">
          {["peaks", "sites", "zones"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 text-[11px] py-2 rounded-lg transition font-bold ${
                tab === t ? "bg-accent/20 text-accent border border-accent/50 glow-accent" : "bg-panelLight text-slate-400 border border-transparent hover:border-white/10"
              }`}>
              {t === "peaks" ? "▲ Terrain" : t === "sites" ? "◉ Sites" : "⛒ Zones"}
            </button>
          ))}
        </div>

        {tab === "peaks" && (
          <Panel title="Terrain Features" count={terrainFeatures.length}>
            {terrainFeatures.map((t) => (
              <div key={t.name} className="rounded-lg bg-panelLight border border-white/5 p-2.5 hover:border-accent/30 transition">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-200 font-semibold">{t.name}</span>
                  <span className={t.elev > 1200 ? "text-bad font-black" : "text-accent font-black"}>{t.elev} m</span>
                </div>
                <div className="text-slate-500 text-[10px] font-mono mt-0.5">{t.lat.toFixed(4)}, {t.lng.toFixed(4)}</div>
              </div>
            ))}
          </Panel>
        )}
        {tab === "sites" && (
          <Panel title="Launch Sites" count={launchSites.length}>
            {launchSites.map((s) => (
              <div key={s.name} className="rounded-lg bg-panelLight border border-white/5 p-2.5 hover:border-accent/30 transition">
                <div className="text-[11px] text-slate-200 font-semibold">{s.name}</div>
                <div className="text-slate-500 text-[10px] font-mono">Elev {s.elev} m</div>
              </div>
            ))}
          </Panel>
        )}
        {tab === "zones" && (
          <Panel title="Airspace Zones" count={airspaceZones.length}>
            {airspaceZones.map((z) => (
              <div key={z.id} className="rounded-lg bg-panelLight border border-white/5 p-2.5 hover:border-accent/30 transition">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-200 font-semibold truncate">{z.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider ${
                    z.type === "RED" ? "bg-bad/20 text-bad" :
                    z.type === "YELLOW" ? "bg-warn/20 text-warn" : "bg-good/20 text-good"
                  }`}>{z.type}</span>
                </div>
                <div className="text-slate-500 text-[10px] mt-0.5">{z.note}</div>
              </div>
            ))}
          </Panel>
        )}
      </aside>
    </div>
  );
}

function Panel({ title, count, children }) {
  return (
    <div className="glass rounded-xl p-3 brackets">
      <div className="flex justify-between mb-2">
        <span className="text-[11px] font-black text-accent uppercase tracking-wider">{title}</span>
        <span className="text-[10px] text-slate-500 font-mono">{count}</span>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}