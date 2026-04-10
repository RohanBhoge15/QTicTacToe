import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Full-screen collapse flash + shockwave + lightning effect.
 * Triggers when a collapse event occurs.
 */
export default function CollapseAnimation() {
  const collapseEvents = useGameStore(s => s.collapseEvents);
  const [showFlash, setShowFlash] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);
  const [showLightning, setShowLightning] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    if (collapseEvents.length > prevCount) {
      setPrevCount(collapseEvents.length);
      triggerCollapse();
    }
  }, [collapseEvents.length]);

  const triggerCollapse = () => {
    setShowFlash(true);
    setShowLightning(true);
    setTimeout(() => setShowShockwave(true), 100);
    setTimeout(() => setShowFlash(false), 400);
    setTimeout(() => setShowLightning(false), 600);
    setTimeout(() => setShowShockwave(false), 700);
  };

  return (
    <>
      {showFlash && <div className="collapse-flash" />}
      {showShockwave && <div className="collapse-shockwave" />}
      {showLightning && <LightningBolts />}
    </>
  );
}

function LightningBolts() {
  const bolts = Array.from({ length: 3 }, (_, i) => {
    const startX = 30 + Math.random() * 40;
    const points: string[] = [`${startX},0`];
    let x = startX;
    for (let y = 10; y <= 100; y += 10) {
      x += (Math.random() - 0.5) * 15;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  });

  return (
    <svg
      className="fixed inset-0 pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 10001, width: '100%', height: '100%' }}
    >
      <defs>
        <filter id="lightning-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {bolts.map((points, i) => (
        <polyline
          key={i}
          points={points}
          fill="none"
          stroke="#ff2222"
          strokeWidth="0.4"
          filter="url(#lightning-glow)"
          opacity={0.8 - i * 0.2}
        >
          <animate
            attributeName="opacity"
            values="0.9;0.3;0.8;0.1;0"
            dur="0.5s"
            fill="freeze"
          />
        </polyline>
      ))}
    </svg>
  );
}
