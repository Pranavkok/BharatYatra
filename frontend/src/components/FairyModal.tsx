import React, { useState } from 'react';
import { useGameStore } from '../game/store';
import { gameClient } from '../game/ws.client';
import { GAME_CONFIG } from '../game/types';
import { motion } from 'framer-motion';
import { Sparkles, Star, Coins, ArrowRight } from 'lucide-react';

export const FairyModal: React.FC = () => {
  const { setShowFairyModal, getMyPlayer } = useGameStore();
  const [starsToExchange, setStarsToExchange] = useState(1);

  const myPlayer = getMyPlayer();
  if (!myPlayer) return null;

  const costPerStar = GAME_CONFIG.FAIRY_STAR_COST;
  const totalCost = starsToExchange * costPerStar;
  const canAfford = myPlayer.coins >= totalCost;
  const maxStars = Math.floor(myPlayer.coins / costPerStar);

  const handleExchange = () => {
    if (canAfford && starsToExchange > 0) {
      gameClient.fairyInteraction('EXCHANGE', starsToExchange);
    }
  };

  const handleSkip = () => {
    gameClient.fairyInteraction('SKIP');
    setShowFairyModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-4xl">
            🧚
          </div>
          <h2 className="text-2xl font-bold">The Magical Fairy!</h2>
          <p className="text-white/80 text-sm mt-1">
            Exchange your coins for precious stars
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Status */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-xl">
                <Coins className="w-5 h-5" />
                {myPlayer.coins}
              </div>
              <p className="text-sm text-gray-500">Your Coins</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold text-xl">
                <Star className="w-5 h-5" />
                {myPlayer.stars}/10
              </div>
              <p className="text-sm text-gray-500">Your Stars</p>
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-purple-700">
              <span className="flex items-center gap-1">
                <Coins className="w-4 h-4" /> {costPerStar}
              </span>
              <ArrowRight className="w-4 h-4" />
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" /> 1
              </span>
            </div>
            <p className="text-center text-sm text-purple-600 mt-1">Exchange Rate</p>
          </div>

          {/* Star Selector */}
          {maxStars > 0 ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How many stars do you want?
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStarsToExchange(Math.max(1, starsToExchange - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                  disabled={starsToExchange <= 1}
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <span className="text-3xl font-bold text-purple-600">{starsToExchange}</span>
                  <span className="text-gray-500 ml-2">star{starsToExchange > 1 ? 's' : ''}</span>
                </div>
                <button
                  onClick={() => setStarsToExchange(Math.min(maxStars, starsToExchange + 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                  disabled={starsToExchange >= maxStars}
                >
                  +
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                Cost: <span className="font-medium text-amber-600">{totalCost} coins</span>
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-red-50 rounded-xl text-center text-red-600">
              You don't have enough coins! You need at least {costPerStar} coins.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleExchange}
              disabled={!canAfford || starsToExchange < 1}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Exchange
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
