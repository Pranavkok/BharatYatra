import type { Player } from '../game/types';
import { Star, Coins, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlayerPanelProps {
  players: Player[];
  currentPlayerId: string | null;
  currentTurnIndex: number;
}

// Player color names for display
const colorNames: Record<string, string> = {
  '#ef4444': 'Red',
  '#3b82f6': 'Blue',
  '#22c55e': 'Green',
  '#f59e0b': 'Yellow',
};

export const PlayerPanel: React.FC<PlayerPanelProps> = ({
  players,
  currentPlayerId,
  currentTurnIndex,
}) => {
  // Sort players by stars (descending) for leaderboard style
  const sortedPlayers = [...players].sort((a, b) => b.stars - a.stars);
  const leaderPlayerId = sortedPlayers[0]?.id;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span>Players</span>
        <span className="text-sm font-normal text-gray-500">({players.length}/4)</span>
      </h2>

      <div className="space-y-2">
        {players.map((player, index) => {
          const isMe = player.id === currentPlayerId;
          const isCurrentTurn = index === currentTurnIndex;
          const isLeader = player.id === leaderPlayerId && player.stars > 0;
          const colorName = colorNames[player.color] || 'Player';

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-xl transition-all relative overflow-hidden ${
                isCurrentTurn
                  ? 'bg-gradient-to-r from-orange-50 to-orange-100'
                  : isMe
                  ? 'bg-blue-50'
                  : 'bg-gray-50'
              }`}
              style={{
                borderLeft: `4px solid ${player.color}`,
                boxShadow: isCurrentTurn ? `0 0 0 1px ${player.color}40` : undefined,
              }}
            >
              {/* Turn indicator animation */}
              {isCurrentTurn && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{ x: ['0%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  style={{ width: '50%' }}
                />
              )}

              <div className="flex items-center gap-3 relative z-10">
                {/* Avatar with player color */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                    isCurrentTurn ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{
                    backgroundColor: player.color,
                    ['--tw-ring-color' as string]: isCurrentTurn ? player.color : undefined,
                  }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-800 truncate">
                      {player.name}
                    </span>
                    {isLeader && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                    {isMe && (
                      <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
                        You
                      </span>
                    )}
                    {isCurrentTurn && (
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="text-xs text-white px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: player.color }}
                      >
                        Turn
                      </motion.span>
                    )}
                    {player.isBlocked && (
                      <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                        Blocked
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="flex items-center gap-1 text-yellow-600 font-medium">
                      <Star className="w-3 h-3 fill-yellow-400" />
                      {player.stars}/10
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <Coins className="w-3 h-3" />
                      {player.coins}
                    </span>
                    {player.cards.length > 0 && (
                      <span className="flex items-center gap-1 text-purple-600">
                        <Zap className="w-3 h-3" />
                        {player.cards.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Color indicator */}
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: player.color }}
                  title={`${colorName} Player`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Color legend */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
          {Object.entries(colorNames).map(([hex, name]) => (
            <div key={hex} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: hex }}
              />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
