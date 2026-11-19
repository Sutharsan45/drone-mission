import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { terrainFeatures, launchSites, JMU_CENTER } from "../data/jammuData";

// Convert lat/lng to local scene X/Z around Jammu center
const project = (lat, lng) => ({
  x: (lng - JMU_CENTER.lng) * 111 * 0.25,
  z: -(lat - JMU_CENTER.lat) * 111 * 0.25,
});

function TerrainMesh() {
  const geom = useMemo(() => {
    const size = 30, seg = 96;
    const g = new THREE.PlaneGeometry(size, size, seg, seg);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      // Procedural Shivalik hills + ridges around Jammu
      let h = 0;
      h += Math.sin(x * 0.35) * Math.cos(z * 0.3) * 0.6;
      h += Math.sin(x * 0.9 + 1.5) * 0.25;
      h += Math.cos(z * 1.1 - 0.5) * 0.2;
      h += Math.max(0, -x * 0.12) * 0.8; // rise toward north (higher)
      h += Math.max(0, z * 0.05);
      pos.setY(i, h + 0.3);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geom} receiveShadow>
        <meshStandardMaterial
            color="#0f2e26"
            emissive="#0a1f1a"
            emissiveIntensity={0.25}
            roughness={0.85}
            metalness={0.15}
            flatShading
            />
    </mesh>
  );
}

function TerrainWire() {
  const geom = useMemo(() => {
    const size = 30, seg = 60;
    const g = new THREE.PlaneGeometry(size, size, seg, seg);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      let h = 0;
      h += Math.sin(x * 0.35) * Math.cos(z * 0.3) * 0.6;
      h += Math.sin(x * 0.9 + 1.5) * 0.25;
      h += Math.cos(z * 1.1 - 0.5) * 0.2;
      h += Math.max(0, -x * 0.12) * 0.8;
      h += Math.max(0, z * 0.05);
      pos.setY(i, h + 0.3);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <lineSegments>
      <wireframeGeometry attach="geometry" args={[geom]} />
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.08} />
    </lineSegments>
  );
}

function Marker({ lat, lng, label, color = "#38bdf8", elev = 0 }) {
  const p = project(lat, lng);
  const y = 0.3 + elev / 1200;
  return (
    <group position={[p.x, y, p.z]}>
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 6]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <Html distanceFactor={14} position={[0, 1.6, 0]} center>
        <div className="px-2 py-1 rounded bg-slatebase/90 border border-accent/40 text-[10px] text-accent whitespace-nowrap">
          {label}
        </div>
      </Html>
    </group>
  );
}

function DroneFlyover() {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = Math.sin(t * 0.4) * 6;
      ref.current.position.z = Math.cos(t * 0.4) * 6;
      ref.current.position.y = 3.5 + Math.sin(t * 1.2) * 0.3;
      ref.current.rotation.y = -t * 0.4;
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} />
      </mesh>
      <pointLight color="#f59e0b" intensity={2} distance={4} />
    </group>
  );
}

export default function Terrain3D() {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [12, 12, 12], fov: 50 }}>
        <fog attach="fog" args={["#0b1220", 20, 45]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 18, 8]} intensity={1.4} castShadow color="#cfe8ff" />
        <pointLight position={[-10, 8, -8]} intensity={0.6} color="#38bdf8" />

        <TerrainMesh />
        <TerrainWire />

        {launchSites.map((s, i) => (
          <Marker key={i} lat={s.lat} lng={s.lng} label={s.name} color="#22c55e" elev={s.elev} />
        ))}
        {terrainFeatures.filter((t) => t.elev > 900).map((t, i) => (
          <Marker key={`f${i}`} lat={t.lat} lng={t.lng} label={`${t.name} (${t.elev} m)`} color="#ef4444" elev={t.elev} />
        ))}

        <DroneFlyover />

        <OrbitControls enablePan autoRotate autoRotateSpeed={0.4} minDistance={8} maxDistance={40} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
    </div>
  );
}