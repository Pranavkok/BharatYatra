import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/store';
import { motion } from 'framer-motion';
import { Trophy, Star, Coins, Medal } from 'lucide-react';

export const GameOverModal: React.FC = () => {
  const navigate = useNavigate();
  const { gameOverData, playerId, reset } = useGameStore();

  if (!gameOverData) return null;

  const isWinner = gameOverData.winnerId === playerId;
  const sortedScores = [...gameOverData.finalScores].sort((a, b) => b.stars - a.stars);

  const handlePlayAgain = () => {
    reset();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header - Winner Announcement */}
        <div
          className={`p-8 text-center ${
            isWinner
              ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500'
              : 'bg-gradient-to-br from-indigo-500 to-purple-600'
          } text-white`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Trophy className={`w-10 h-10 ${isWinner ? 'text-yellow-200' : 'text-white'}`} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2"
          >
            {isWinner ? 'You Won!' : 'Game Over!'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80"
          >
            {isWinner
              ? 'Congratulations on your victory!'
              : `${gameOverData.winnerName} wins the game!`}
          </motion.p>
        </div>

        {/* Scoreboard */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Final Standings
          </h3>

          <div className="space-y-3">
            {sortedScores.map((player, index) => {
              const isMe = player.playerId === playerId;
              const getMedalColor = () => {
                if (index === 0) return 'text-yellow-500';
                if (index === 1) return 'text-gray-400';
                if (index === 2) return 'text-amber-600';
                return 'text-gray-300';
              };

              return (
                <motion.div
                  key={player.playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    isMe ? 'bg-orange-50 border-2 border-orange-200' : 'bg-gray-50'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-8 h-8 flex items-center justify-center ${getMedalColor()}`}>
                    {index < 3 ? (
                      <Medal className="w-6 h-6" />
                    ) : (
                      <span className="font-bold text-gray-400">{index + 1}</span>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {player.name}
                      {isMe && (
                        <span className="ml-2 text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-yellow-600 font-medium">
                      <Star className="w-4 h-4" />
                      {player.stars}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <Coins className="w-4 h-4" />
                      {player.coins}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Play Again Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={handlePlayAgain}
            className="w-full mt-6 py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
          >
            Play Again
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
