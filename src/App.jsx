import React from "react";
import { Routes, Route } from "react-router-dom";
import Shell from "./components/Shell";
import Overview from "./pages/Overview";
import TerrainPage from "./pages/TerrainPage";
import PlanPage from "./pages/PlanPage";
import RiskPage from "./pages/RiskPage";
import RecordsPage from "./pages/RecordsPage";
import TracePage from "./pages/TracePage";

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/terrain" element={<TerrainPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/risk" element={<RiskPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/trace" element={<TracePage />} />
      </Routes>
    </Shell>
  );
}