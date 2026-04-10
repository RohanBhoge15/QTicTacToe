import { useState, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useKeyboard } from './hooks/useKeyboard';
import { useGameStore } from './store/gameStore';

// Components
import NeonParticlesBg from './components/NeonParticlesBg';
import CRTOverlay from './components/CRTOverlay';
import LoadingScreen from './components/LoadingScreen';
import GameHeader from './components/GameHeader';
import NeonBoard from './components/NeonBoard';
import EntanglementBeams from './components/EntanglementBeams';
import CollapseAnimation from './components/CollapseAnimation';
import PlayerInfo from './components/PlayerInfo';
import MoveHistory from './components/MoveHistory';
import CycleDetectorIndicator from './components/CycleDetectorIndicator';
import QuantumCircuitViewer from './components/QuantumCircuitViewer';
import MetricsHUD from './components/MetricsHUD';
import EntanglementGraphVis from './components/EntanglementGraphVis';
import GameModeSelector from './components/GameModeSelector';
import HowToPlayModal from './components/HowToPlayModal';
import SoundManager from './components/SoundManager';

// Lazy load Bloch Spheres (heavy Three.js)
const BlochSphereGrid = lazy(() => import('./components/BlochSphereGrid'));

export default function App() {
  const [loading, setLoading] = useState(true);
  const isTestcaseRunning = useGameStore(s => s.isTestcaseRunning);

  useKeyboard();

  if (loading) {
    return (
      <AnimatePresence>
        <LoadingScreen onComplete={() => setLoading(false)} />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-void text-gray-200 relative overflow-hidden">
      {/* Background layers */}
      <NeonParticlesBg />
      <div className="fog-layer" />
      <CRTOverlay />

      {/* Sound */}
      <SoundManager />

      {/* Collapse flash */}
      <CollapseAnimation />

      {/* Testcase banner */}
      {isTestcaseRunning && (
        <div className="testcase-banner">
          TESTCASE RUNNING... SEED=42
        </div>
      )}

      {/* Main layout */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-3 py-4"
        style={{ paddingTop: isTestcaseRunning ? '48px' : '16px' }}
      >
        <GameHeader />

        {/* HUD Layout: Left | Center | Right */}
        <div className="mt-4 grid gap-4" style={{
          gridTemplateColumns: 'minmax(200px, 280px) minmax(300px, 420px) minmax(200px, 280px)',
        }}>
          {/* ── LEFT PANEL ── */}
          <div className="space-y-3">
            <PlayerInfo />
            <MoveHistory />
            <EntanglementGraphVis />
          </div>

          {/* ── CENTER: BOARD ── */}
          <div className="flex flex-col items-center">
            {/* Select instruction */}
            <SelectInstruction />

            <div className="relative w-full" style={{ maxWidth: 380 }}>
              <NeonBoard />
              <EntanglementBeams />
            </div>

          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="space-y-3">
            <CycleDetectorIndicator />
            <MetricsHUD />
          </div>
        </div>

        {/* Bottom full-width: Bloch Spheres + Circuit Viewer */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Suspense fallback={
            <div className="glass-panel p-3 text-center">
              <p className="text-xs opacity-30">Loading Bloch Spheres...</p>
            </div>
          }>
            <BlochSphereGrid />
          </Suspense>
          <QuantumCircuitViewer />
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <p className="font-mono text-xs opacity-15 tracking-wider">
            NEON QUANTUM v1.0 | QUANTUM COMPUTING CONFERENCE DEMO
          </p>
        </footer>
      </div>

      {/* Modals */}
      <GameModeSelector />
      <HowToPlayModal />

      {/* Mobile responsive overlay for narrow screens */}
      <style>{`
        @media (max-width: 900px) {
          .grid[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function SelectInstruction() {
  const selectedCells = useGameStore(s => s.selectedCells);
  const gameOver = useGameStore(s => s.gameOver);
  const currentPlayer = useGameStore(s => s.currentPlayer);

  if (gameOver) return null;

  const colorClass = currentPlayer === 'X' ? 'neon-text-cyan' : 'neon-text-magenta';

  return (
    <div className="mb-2 text-center">
      {selectedCells.length === 0 ? (
        <p className={`font-display text-xs tracking-wider ${colorClass} opacity-70`}>
          SELECT FIRST CELL FOR {currentPlayer}
        </p>
      ) : (
        <p className="font-display text-xs tracking-wider neon-text-gold opacity-70">
          CELL {selectedCells[0]} SELECTED — PICK SECOND CELL
        </p>
      )}
    </div>
  );
}
