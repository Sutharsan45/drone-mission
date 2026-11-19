// Central static dataset for Drone Mission Assist — Jammu Region

export const JMU_CENTER = { lat: 32.7266, lng: 74.8570 };

// Airspace zones (mock realistic for demo)
export const airspaceZones = [
  { id: "AZ1", name: "Jammu Airport CTR", type: "RED", lat: 32.6891, lng: 74.8375, radius: 8000, ceiling: 1500, floor: 0, note: "Controlled — ATC clearance required" },
  { id: "AZ2", name: "Ratnuchak Cantt", type: "RED", lat: 32.7830, lng: 74.8130, radius: 3500, ceiling: 1200, floor: 0, note: "Military restricted" },
  { id: "AZ3", name: "Sunjuwan Military Station", type: "RED", lat: 32.7007, lng: 74.9246, radius: 3000, ceiling: 1000, floor: 0, note: "No-fly" },
  { id: "AZ4", name: "Tawi River Corridor", type: "GREEN", lat: 32.7150, lng: 74.8700, radius: 4000, ceiling: 400, floor: 0, note: "Permitted below 400m AGL" },
  { id: "AZ5", name: "Border Belt (IB)", type: "YELLOW", lat: 32.6100, lng: 74.7000, radius: 12000, ceiling: 300, floor: 0, note: "Caution — border belt, notify" },
  { id: "AZ6", name: "Nandini Wildlife Sanctuary", type: "YELLOW", lat: 32.8250, lng: 74.9000, radius: 5000, ceiling: 300, floor: 0, note: "Environmental sensitive" },
];

// Terrain points (high/low spots around Jammu)
export const terrainFeatures = [
  { name: "Trikuta Hills", lat: 32.9930, lng: 74.9480, elev: 1585 },
  { name: "Shivalik Ridge", lat: 32.7800, lng: 74.7300, elev: 780 },
  { name: "Mansar Ridge", lat: 32.7170, lng: 75.0200, elev: 620 },
  { name: "Tawi Plains", lat: 32.7100, lng: 74.8600, elev: 305 },
  { name: "Pir Panjal Foothills", lat: 33.0200, lng: 74.7600, elev: 2100 },
  { name: "Nagrota Ridge", lat: 32.7800, lng: 74.9200, elev: 660 },
];

// Airports / launch pads
export const launchSites = [
  { name: "Jammu Airport", lat: 32.6891, lng: 74.8375, elev: 314 },
  { name: "Nagrota Launch Pad", lat: 32.7830, lng: 74.9200, elev: 660 },
  { name: "Mansar Launch Pad", lat: 32.7170, lng: 75.0200, elev: 620 },
  { name: "Akhnoor Field", lat: 32.8980, lng: 74.7400, elev: 330 },
];

// Platform specs
export const platforms = [
  {
    id: "P1", name: "Skylark M2 (Medium Fixed-Wing)", class: "fixed-wing",
    cruise: 22, endurance_sea: 180, range_sea: 260, maxAlt: 4500, payload: 4.5,
    battery: 680, coldDerate: 0.85, altDerate: 0.075,
  },
  {
    id: "P2", name: "HawkEye Q4 (Small Multirotor)", class: "multirotor",
    cruise: 14, endurance_sea: 55, range_sea: 40, maxAlt: 3500, payload: 2.0,
    battery: 420, coldDerate: 0.80, altDerate: 0.10,
  },
  {
    id: "P3", name: "Vayu-9 (Medium Fixed-Wing)", class: "fixed-wing",
    cruise: 25, endurance_sea: 220, range_sea: 320, maxAlt: 5500, payload: 6.0,
    battery: 900, coldDerate: 0.88, altDerate: 0.065,
  },
];

// Mission presets
export const missions = [
  {
    id: "M1", name: "Border Patrol — Akhnoor Sector",
    from: { lat: 32.8980, lng: 74.7400, name: "Akhnoor Field", elev: 330 },
    to: { lat: 32.6100, lng: 74.7000, name: "IB Border Point", elev: 305 },
    payload: 2.0, window: "06:00 – 10:00", type: "Surveillance",
  },
  {
    id: "M2", name: "Logistics — Jammu to Nagrota",
    from: { lat: 32.6891, lng: 74.8375, name: "Jammu Airport", elev: 314 },
    to: { lat: 32.7830, lng: 74.9200, name: "Nagrota Ridge", elev: 660 },
    payload: 4.0, window: "08:00 – 12:00", type: "Logistics",
  },
  {
    id: "M3", name: "Survey — Mansar Corridor",
    from: { lat: 32.7170, lng: 75.0200, name: "Mansar", elev: 620 },
    to: { lat: 32.7266, lng: 74.8570, name: "Jammu City", elev: 320 },
    payload: 1.5, window: "09:00 – 13:00", type: "Survey",
  },
];

// Weather presets
export const weatherPresets = [
  { id: "W1", name: "Clear Morning", temp: 12, wind: 8, gust: 14, rain: 0, vis: 10, rainCell: null },
  { id: "W2", name: "Rising Wind", temp: 18, wind: 22, gust: 38, rain: 0.5, vis: 7, rainCell: { lat: 32.7500, lng: 74.9000, radius: 9000 } },
  { id: "W3", name: "Rain Cell Approaching", temp: 14, wind: 18, gust: 32, rain: 3.2, vis: 3, rainCell: { lat: 32.7800, lng: 74.8500, radius: 14000 } },
];

// Hard limits for risk
export const riskThresholds = {
  wind: { safe: 10, limit: 25 },
  gust: { safe: 15, limit: 40 },
  rain: { safe: 0.5, limit: 4 },
  vis: { safe: 8, limit: 2 },
  temp: { cold: -5, hot: 45 },
};

// Historical missions (for O10 validation)
export const historicalMissions = [
  { id: "H1", name: "Akhnoor Patrol 2024-11", route: "Akhnoor → IB", outcome: "Completed", risk: 32, duration: "52 min", note: "Wind within limits" },
  { id: "H2", name: "Mansar Survey 2024-09", route: "Mansar → Jammu", outcome: "Aborted", risk: 74, duration: "18 min", note: "Rain cell intrusion at 09:40" },
  { id: "H3", name: "Nagrota Logistics 2024-10", route: "Airport → Nagrota", outcome: "Completed", risk: 41, duration: "34 min", note: "Payload derate 6%" },
  { id: "H4", name: "High-Altitude Replay (Pir Panjal)", route: "Pir Panjal Foothills", outcome: "Conditional", risk: 58, duration: "61 min", note: "Above 2100 m — endurance warning" },
];

// Traceability matrix (Appendix A)
export const traceability = [
  { obj: "O1", module: "Data integration", req: "R1-R3", test: "T1", gap: "Gap 1" },
  { obj: "O2", module: "Platform performance", req: "R4-R6", test: "T2", gap: "Gap 2" },
  { obj: "O3", module: "Environmental risk", req: "R7-R9", test: "T3", gap: "Gap 3" },
  { obj: "O4", module: "Constraint finder", req: "R10-R12", test: "T4", gap: "Gap 4" },
  { obj: "O5", module: "Feasibility", req: "R13-R15", test: "T5", gap: "Gap 2,6" },
  { obj: "O6", module: "Route recommendation", req: "R16-R18", test: "T6", gap: "Gap 4" },
  { obj: "O7", module: "Re-assessment", req: "R19-R21", test: "T7", gap: "Gap 5" },
  { obj: "O8", module: "Explain & record", req: "R22-R24", test: "T8", gap: "Gap 6" },
  { obj: "O9", module: "Field usability", req: "R25-R27", test: "T9", gap: "Gap 7" },
  { obj: "O10", module: "Validation", req: "R28-R30", test: "T10", gap: "All" },
];