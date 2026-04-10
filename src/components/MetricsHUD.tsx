import { useGameStore } from '../store/gameStore';
import { useQuantumSimulation } from '../hooks/useQuantumSimulation';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  LineChart, Line
} from 'recharts';

export default function MetricsHUD() {
  return (
    <div className="space-y-3">
      <EntropyHeatmap />
      <ProbabilityMatrix />
      <PlayerRadar />
      <MoveTimeChart />
      <QuantumBitCount />
    </div>
  );
}

function EntropyHeatmap() {
  const getEntropy = useGameStore(s => s.getEntropy);
  const entropy = getEntropy();

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs neon-text-cyan tracking-widest text-center mb-2">
        ENTROPY HEATMAP
      </p>
      <div className="grid grid-cols-3 gap-1" style={{ maxWidth: 150, margin: '0 auto' }}>
        {entropy.map((e, i) => {
          const intensity = Math.min(e, 1);
          return (
            <div
              key={i}
              className="aspect-square flex items-center justify-center rounded text-xs font-mono"
              style={{
                background: `rgba(${Math.round(intensity * 255)}, ${Math.round((1 - intensity) * 100)}, ${Math.round(intensity * 200)}, ${0.2 + intensity * 0.4})`,
                border: `1px solid rgba(187, 0, 255, ${0.1 + intensity * 0.5})`,
                color: `rgba(255, 255, 255, ${0.4 + intensity * 0.6})`,
                fontSize: '0.6rem',
              }}
            >
              {e.toFixed(2)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProbabilityMatrix() {
  const getCellProbabilities = useGameStore(s => s.getCellProbabilities);
  const probs = getCellProbabilities();

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs neon-text-cyan tracking-widest text-center mb-2">
        COLLAPSE PROBABILITY
      </p>
      <div className="grid grid-cols-3 gap-1" style={{ maxWidth: 150, margin: '0 auto' }}>
        {probs.map((p, i) => {
          const xInt = p.X;
          const oInt = p.O;
          return (
            <div
              key={i}
              className="aspect-square flex flex-col items-center justify-center rounded text-xs font-mono"
              style={{
                background: `linear-gradient(135deg, rgba(0,240,255,${xInt * 0.3}), rgba(255,0,170,${oInt * 0.3}))`,
                border: `1px solid rgba(100, 100, 200, 0.2)`,
                fontSize: '0.5rem',
              }}
            >
              {(xInt > 0 || oInt > 0) ? (
                <>
                  <span style={{ color: '#00f0ff' }}>{(xInt * 100).toFixed(0)}%</span>
                  <span style={{ color: '#ff00aa' }}>{(oInt * 100).toFixed(0)}%</span>
                </>
              ) : (
                <span className="opacity-20">-</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlayerRadar() {
  const classicalBoard = useGameStore(s => s.classicalBoard);
  const moves = useGameStore(s => s.moves);
  const entanglementGraph = useGameStore(s => s.entanglementGraph);

  const xMoves = moves.filter(m => m.player === 'X');
  const oMoves = moves.filter(m => m.player === 'O');
  const xClassical = classicalBoard.filter(c => c === 'X').length;
  const oClassical = classicalBoard.filter(c => c === 'O').length;

  const data = [
    {
      axis: 'Superposition',
      X: xMoves.filter(m => !m.collapsed).length * 20,
      O: oMoves.filter(m => !m.collapsed).length * 20,
    },
    {
      axis: 'Center',
      X: classicalBoard[4] === 'X' ? 100 : moves.some(m => m.player === 'X' && m.cells.includes(4) && !m.collapsed) ? 50 : 0,
      O: classicalBoard[4] === 'O' ? 100 : moves.some(m => m.player === 'O' && m.cells.includes(4) && !m.collapsed) ? 50 : 0,
    },
    {
      axis: 'Win Pot.',
      X: Math.min(xClassical * 35, 100),
      O: Math.min(oClassical * 35, 100),
    },
    {
      axis: 'Entangle',
      X: Math.min(xMoves.length * 20, 100),
      O: Math.min(oMoves.length * 20, 100),
    },
    {
      axis: 'Risk',
      X: Math.min(entanglementGraph.getEdges().filter(e => xMoves.some(m => m.id === e.moveId)).length * 25, 100),
      O: Math.min(entanglementGraph.getEdges().filter(e => oMoves.some(m => m.id === e.moveId)).length * 25, 100),
    },
  ];

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs neon-text-cyan tracking-widest text-center mb-1">
        PLAYER ADVANTAGE
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(100,100,200,0.15)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#8888aa', fontSize: 9 }}
          />
          <Radar name="X" dataKey="X" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.15} />
          <Radar name="O" dataKey="O" stroke="#ff00aa" fill="#ff00aa" fillOpacity={0.15} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function MoveTimeChart() {
  const moveTimestamps = useGameStore(s => s.moveTimestamps);

  if (moveTimestamps.length === 0) return null;

  const data = moveTimestamps.map((t, i) => ({
    move: i + 1,
    time: Math.min(t.time / 1000, 30),
    player: t.player,
  }));

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs neon-text-cyan tracking-widest text-center mb-1">
        MOVE TIME (s)
      </p>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data}>
          <XAxis dataKey="move" tick={{ fill: '#666', fontSize: 9 }} />
          <YAxis tick={{ fill: '#666', fontSize: 9 }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(10,10,40,0.9)',
              border: '1px solid rgba(0,240,255,0.3)',
              borderRadius: 8,
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="time"
            stroke="#ffd700"
            strokeWidth={2}
            dot={{ fill: '#ffd700', r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function QuantumBitCount() {
  const { totalQubits, totalEntropy, superpositionCount } = useQuantumSimulation();

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs neon-text-cyan tracking-widest text-center mb-2">
        QUANTUM BITS
      </p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="font-mono text-xl neon-text-cyan font-bold">{totalQubits}</div>
          <div className="text-xs opacity-40">Active</div>
        </div>
        <div>
          <div className="font-mono text-xl neon-text-gold font-bold">{totalEntropy.toFixed(1)}</div>
          <div className="text-xs opacity-40">Entropy</div>
        </div>
        <div>
          <div className="font-mono text-xl neon-text-violet font-bold">{superpositionCount}</div>
          <div className="text-xs opacity-40">Superpos.</div>
        </div>
      </div>
    </div>
  );
}
