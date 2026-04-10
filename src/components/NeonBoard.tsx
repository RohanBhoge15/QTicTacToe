import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function NeonBoard() {
  const classicalBoard = useGameStore(s => s.classicalBoard);
  const quantumMarks = useGameStore(s => s.quantumMarks);
  const selectedCells = useGameStore(s => s.selectedCells);
  const selectCell = useGameStore(s => s.selectCell);
  const gameOver = useGameStore(s => s.gameOver);
  const winLine = useGameStore(s => s.winLine);
  const currentPlayer = useGameStore(s => s.currentPlayer);
  const gameMode = useGameStore(s => s.gameMode);
  const moves = useGameStore(s => s.moves);

  const isBlindMode = gameMode === 'blind';

  return (
    <div className="relative">
      {/* Scan line */}
      <div className="grid-scan-line" />

      <div className="quantum-grid" style={{ width: '100%', maxWidth: 380 }}>
        {Array.from({ length: 9 }, (_, i) => {
          const classical = classicalBoard[i];
          const quantum = quantumMarks[i];
          const isSelected = selectedCells.includes(i);
          const isWinCell = winLine?.includes(i);
          const isCollapsed = classical !== null;
          const isFree = classical === null;

          // In blind mode, hide opponent's superposition marks
          const visibleMarks = isBlindMode
            ? quantum.filter(m => m.startsWith(currentPlayer))
            : quantum;

          return (
            <motion.div
              key={i}
              className={[
                'quantum-cell',
                isSelected && 'selected',
                isCollapsed && classical === 'X' && 'collapsed-x',
                isCollapsed && classical === 'O' && 'collapsed-o',
                isWinCell && 'win-cell',
                (gameOver || isCollapsed) && 'disabled',
              ].filter(Boolean).join(' ')}
              onClick={() => !gameOver && isFree && selectCell(i)}
              whileHover={isFree && !gameOver ? { scale: 1.03 } : {}}
              whileTap={isFree && !gameOver ? { scale: 0.97 } : {}}
              layout
            >
              {/* Cell index label */}
              <span
                className="absolute top-1 left-1.5 text-xs font-mono opacity-20"
                style={{ fontSize: '0.6rem' }}
              >
                {i}
              </span>

              <AnimatePresence mode="wait">
                {classical ? (
                  <motion.div
                    key={`classical-${i}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`classical-mark ${classical === 'X' ? 'classical-mark-x' : 'classical-mark-o'}`}
                  >
                    {classical}
                  </motion.div>
                ) : visibleMarks.length > 0 ? (
                  <motion.div
                    key={`quantum-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-0.5 items-center justify-center p-1"
                  >
                    {visibleMarks.map((label, j) => {
                      const isX = label.startsWith('X');
                      return (
                        <motion.span
                          key={`${label}-${j}`}
                          className={`superposition-mark ${isX ? 'neon-text-cyan' : 'neon-text-magenta'}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: j * 0.05, type: 'spring' }}
                          style={{ animationDelay: `${j * 0.2}s` }}
                        >
                          {label}
                        </motion.span>
                      );
                    })}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Inner glow for selected */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
                  }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Floating particles for superposition cells */}
              {!classical && visibleMarks.length > 0 && (
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                  {[...Array(3)].map((_, k) => (
                    <motion.div
                      key={k}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        background: visibleMarks[0]?.startsWith('X') ? '#00f0ff' : '#ff00aa',
                        left: `${20 + k * 25}%`,
                        top: `${30 + k * 15}%`,
                      }}
                      animate={{
                        y: [-5, 5, -5],
                        x: [-3, 3, -3],
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 2 + k * 0.5,
                        repeat: Infinity,
                        delay: k * 0.3,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
