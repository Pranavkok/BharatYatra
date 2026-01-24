import type { Player } from '../game/types';
import { Star, Coins, Zap } from 'lucide-react';

interface PlayerPanelProps {
  players: Player[];
  currentPlayerId: string | null;
  currentTurnIndex: number;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({
  players,
  currentPlayerId,
  currentTurnIndex,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Players</h2>

      <div className="space-y-2">
        {players.map((player, index) => {
          const isMe = player.id === currentPlayerId;
          const isCurrentTurn = index === currentTurnIndex;

          return (
            <div
              key={player.id}
              className={`p-3 rounded-xl transition-all ${
                isCurrentTurn
                  ? 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200'
                  : isMe
                  ? 'bg-blue-50 border border-blue-100'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    isCurrentTurn ? 'ring-2 ring-orange-400 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: player.color }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 truncate">
                      {player.name}
                    </span>
                    {isMe && (
                      <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
                        You
                      </span>
                    )}
                    {isCurrentTurn && (
                      <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded animate-pulse">
                        Turn
                      </span>
                    )}
                    {player.isBlocked && (
                      <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                        Blocked
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Star className="w-3 h-3" />
                      {player.stars}
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
