import { useGameStore } from '../store/gameStore';
import { useEffect, useRef } from 'react';

/**
 * Simple force-directed entanglement graph visualization using canvas.
 */
export default function EntanglementGraphVis() {
  const entanglementGraph = useGameStore(s => s.entanglementGraph);
  const edges = entanglementGraph.getEdges();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Get unique nodes
    const nodes = new Set<number>();
    for (const e of edges) {
      nodes.add(e.cellA);
      nodes.add(e.cellB);
    }

    // Position nodes in a circle
    const nodeArr = [...nodes];
    const positions: Record<number, { x: number; y: number }> = {};
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.35;

    nodeArr.forEach((n, i) => {
      const angle = (i / Math.max(nodeArr.length, 1)) * Math.PI * 2 - Math.PI / 2;
      positions[n] = {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      };
    });

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw edges
    for (const e of edges) {
      const from = positions[e.cellA];
      const to = positions[e.cellB];
      if (!from || !to) continue;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = '#bb00ff';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#bb00ff';
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw nodes
    for (const n of nodeArr) {
      const pos = positions[n];
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f0ff';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = '#00f0ff';
      ctx.font = '10px "Orbitron", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(n), pos.x, pos.y);
    }
  }, [edges]);

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs neon-text-cyan tracking-widest text-center mb-1">
        ENTANGLEMENT GRAPH
      </p>
      <canvas
        ref={canvasRef}
        width={180}
        height={140}
        style={{ width: '100%', height: 'auto', maxHeight: 140 }}
      />
      {edges.length === 0 && (
        <p className="text-xs opacity-20 text-center mt-1">No entanglements</p>
      )}
    </div>
  );
}
