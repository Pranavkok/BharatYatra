import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/store';
import { GAME_CONFIG } from '../game/types';
import { Users, Copy, Check, Star, Coins, MapPin } from 'lucide-react';

export const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, roomId, playerId } = useGameStore();
  const [copied, setCopied] = React.useState(false);

  // Redirect to home if not in a room
  useEffect(() => {
    if (!roomId || !playerId) {
      navigate('/');
    }
  }, [roomId, playerId, navigate]);

  // Navigate to game when game starts
  useEffect(() => {
    if (gameState?.status === 'PLAYING') {
      navigate('/game');
    }
  }, [gameState?.status, navigate]);

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const players = gameState?.players || [];
  const emptySlots = GAME_CONFIG.MAX_PLAYERS - players.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Waiting Room</h1>
          <p className="text-gray-600 mt-1">Waiting for players to join...</p>
        </div>

        {/* Room Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Room Code:</span>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg">
                {roomId?.slice(0, 8)}...
              </code>
              <button
                onClick={handleCopyRoomId}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 text-center">
            Share this code with friends to join!
          </div>
        </div>

        {/* Players List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Players ({players.length}/{GAME_CONFIG.MAX_PLAYERS})
            </h2>
          </div>

          <div className="space-y-3">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  player.id === playerId
                    ? 'bg-orange-50 border-2 border-orange-200'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {player.name}
                      {player.id === playerId && (
                        <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">Player {index + 1}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-yellow-600">
                    <Star className="w-4 h-4" /> {player.stars}
                  </span>
                  <span className="flex items-center gap-1 text-amber-600">
                    <Coins className="w-4 h-4" /> {player.coins}
                  </span>
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400"
              >
                <span>Waiting for player...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 text-center">
          {players.length < GAME_CONFIG.MAX_PLAYERS ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-gray-600">
                Game will start when {GAME_CONFIG.MAX_PLAYERS} players join
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-600 font-medium">
                Starting game...
              </span>
            </div>
          )}
        </div>

        {/* Rules Preview */}
        <div className="mt-6 bg-white/50 rounded-xl p-4 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Quick Rules:</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>Roll dice and move across India</li>
            <li>Answer quizzes to earn coins</li>
            <li>Exchange coins for stars at the Fairy</li>
            <li>First to collect 10 stars wins!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
