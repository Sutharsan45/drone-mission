import { riskThresholds, platforms, airspaceZones, terrainFeatures } from "../data/jammuData";

// O2 — altitude/temp derated endurance
export function platformPerformance(platformId, altM, tempC, payloadKg) {
  const p = platforms.find((x) => x.id === platformId);
  if (!p) return null;

  const altFactor = 1 - p.altDerate * (altM / 1000);
  const coldFactor = tempC < 5 ? p.coldDerate : 1;
  const payloadFactor = 1 - Math.min(payloadKg / p.payload, 1) * 0.12;

  const endurance = p.endurance_sea * altFactor * coldFactor * payloadFactor;
  const range = p.range_sea * altFactor * coldFactor * payloadFactor;

  return {
    platform: p,
    altFactor: +altFactor.toFixed(3),
    coldFactor: +coldFactor.toFixed(3),
    payloadFactor: +payloadFactor.toFixed(3),
    endurance: +endurance.toFixed(1),
    range: +range.toFixed(1),
    maxAltOK: altM <= p.maxAlt,
    warning: altM > p.maxAlt * 0.9 ? "Near service ceiling" : null,
  };
}

// O3 — hazard index 0..1
function hazard(value, safe, limit, inverted = false) {
  if (inverted) {
    // visibility: higher is safer
    if (value >= safe) return 0;
    if (value <= limit) return 1;
    return (safe - value) / (safe - limit);
  }
  if (value <= safe) return 0;
  if (value >= limit) return 1;
  return (value - safe) / (limit - safe);
}

export function environmentalRisk(weather, altM) {
  const w = hazard(weather.wind, riskThresholds.wind.safe, riskThresholds.wind.limit);
  const g = hazard(weather.gust, riskThresholds.gust.safe, riskThresholds.gust.limit);
  const r = hazard(weather.rain, riskThresholds.rain.safe, riskThresholds.rain.limit);
  const v = hazard(weather.vis, riskThresholds.vis.safe, riskThresholds.vis.limit, true);
  const altPenalty = altM > 3000 ? 0.1 : 0;

  const score = Math.min(100, Math.round((w * 0.35 + g * 0.25 + r * 0.2 + v * 0.2 + altPenalty) * 100));

  const hardBreach =
    weather.wind >= riskThresholds.wind.limit ||
    weather.gust >= riskThresholds.gust.limit ||
    weather.rain >= riskThresholds.rain.limit ||
    weather.vis <= riskThresholds.vis.limit;

  const breakdown = {
    wind: +w.toFixed(2), gust: +g.toFixed(2), rain: +r.toFixed(2), visibility: +v.toFixed(2),
  };

  const rating = hardBreach ? "no-go" : score < 35 ? "low" : score < 65 ? "moderate" : "high";
  return { score, rating, breakdown, hardBreach };
}

// Haversine
export function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// O4 — constraint detection
export function findConstraints(from, to) {
  const constraints = [];
  airspaceZones.forEach((z) => {
    const d = distanceKm(to, z);
    if (d * 1000 < z.radius) {
      constraints.push({
        id: z.id, name: z.name, type: z.type,
        severity: z.type === "RED" ? "hard" : z.type === "YELLOW" ? "soft" : "info",
        note: z.note,
      });
    }
  });

  terrainFeatures.forEach((t) => {
    const d = distanceKm(to, t);
    if (d < 8 && t.elev > 1200) {
      constraints.push({
        id: `T-${t.name}`, name: `High terrain: ${t.name}`, type: "TERRAIN",
        severity: "soft", note: `Elev ${t.elev} m — verify clearance`,
      });
    }
  });

  return constraints;
}

// O5 — feasibility
export function feasibility(perf, risk, constraints, mission, distKm) {
  const reasons = [];
  let conditional = false;
  let noGo = false;

  if (risk.hardBreach) {
    noGo = true;
    reasons.push({ level: "bad", text: "Weather exceeds hard limits for this aircraft" });
  }
  if (!perf.maxAltOK) {
    noGo = true;
    reasons.push({ level: "bad", text: "Target altitude above platform service ceiling" });
  }
  const hard = constraints.filter((c) => c.severity === "hard");
  if (hard.length) {
    noGo = true;
    reasons.push({ level: "bad", text: `Restricted airspace: ${hard.map((c) => c.name).join(", ")}` });
  }
  if (distKm > perf.range) {
    noGo = true;
    reasons.push({ level: "bad", text: `Range exceeded (${distKm.toFixed(1)} km > ${perf.range} km)` });
  } else if (distKm > perf.range * 0.85) {
    conditional = true;
    reasons.push({ level: "warn", text: "Range margin below 15% — plan reserve" });
  }
  if (mission.payload > perf.platform.payload) {
    noGo = true;
    reasons.push({ level: "bad", text: "Payload exceeds platform capacity" });
  }
  if (risk.score > 50 && !noGo) {
    conditional = true;
    reasons.push({ level: "warn", text: `Environmental risk ${risk.score}/100 — fly within window` });
  }

  const result = noGo ? "NO-GO" : conditional ? "CONDITIONAL" : "GO";
  if (!reasons.length) reasons.push({ level: "good", text: "All constraints satisfied" });

  return { result, reasons, hardConstraints: hard };
}

// O6 — three candidate routes
export function buildRoutes(from, to) {
  const direct = [from, to];
  const mid1 = { lat: (from.lat + to.lat) / 2 + 0.035, lng: (from.lng + to.lng) / 2 - 0.02 };
  const mid2 = { lat: (from.lat + to.lat) / 2 - 0.03, lng: (from.lng + to.lng) / 2 + 0.025 };
  const routeB = [from, mid1, to];
  const routeC = [from, mid2, to];

  const score = (pts, riskScore) => {
    let d = 0;
    for (let i = 0; i < pts.length - 1; i++) d += distanceKm(pts[i], pts[i + 1]);
    return { distance: +d.toFixed(1), riskScore: Math.round(riskScore * (0.9 + Math.random() * 0.15)) };
  };

  return [
    { id: "R1", name: "Risk-aware (recommended)", points: routeB, ...score(routeB, 28) },
    { id: "R2", name: "Balanced alternate", points: routeC, ...score(routeC, 45) },
    { id: "R3", name: "Direct (distance only)", points: direct, ...score(direct, 72) },
  ];
}