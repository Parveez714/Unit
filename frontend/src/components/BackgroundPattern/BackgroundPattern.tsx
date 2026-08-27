import React from 'react';
import coloursBg from '../../assets/Colours.png';

// Deterministic constellation network (dots + connecting lines)
const WIDTH = 1600;
const HEIGHT = 900;
const COLS = 8;
const ROWS = 6;

function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNetwork() {
  const rand = mulberry32(42);
  const cellW = WIDTH / COLS;
  const cellH = HEIGHT / ROWS;
  const points: { x: number; y: number; r: number }[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * cellW + cellW / 2 + (rand() - 0.5) * cellW * 0.75;
      const y = row * cellH + cellH / 2 + (rand() - 0.5) * cellH * 0.75;
      const r = rand() > 0.85 ? 3.5 : 2;
      points.push({ x, y, r });
    }
  }

  const edgeKeys = new Set<string>();
  const edges: [number, number][] = [];

  points.forEach((p, i) => {
    const nearest = points
      .map((q, j) => ({ j, d: i === j ? Infinity : Math.hypot(p.x - q.x, p.y - q.y) }))
      .sort((a, b) => a.d - b.d);
    const neighbourCount = rand() > 0.7 ? 3 : 2;
    for (let k = 0; k < neighbourCount; k++) {
      const j = nearest[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edgeKeys.has(key)) {
        edgeKeys.add(key);
        edges.push([i, j]);
      }
    }
  });

  for (let k = 0; k < 7; k++) {
    const a = Math.floor(rand() * points.length);
    const b = Math.floor(rand() * points.length);
    if (a !== b) edges.push([a, b]);
  }

  return { points, edges };
}

const { points, edges } = buildNetwork();

export const BackgroundPattern: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* 1. Colours.png Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${coloursBg})`,
          opacity: 0.12 // Kept subtle to sit quietly in the back
        }}
      />

      {/* 2. Constellation Lines and Dots Pattern (Darker) */}
      <div className="absolute inset-0 text-ink-900/[0.22] dark:text-white/[0.18]">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full animate-fade-in"
        >
          {edges.map(([a, b], i) => (
            <line
              key={`e-${i}`}
              x1={points[a].x}
              y1={points[a].y}
              x2={points[b].x}
              y2={points[b].y}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          {points.map((p, i) => (
            <circle key={`p-${i}`} cx={p.x} cy={p.y} r={p.r} fill="currentColor" />
          ))}
        </svg>
      </div>
    </div>
  );
};
