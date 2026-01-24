import React from 'react';
import { useGameStore } from '../game/store';
import { gameClient } from '../game/ws.client';
import { GAME_CONFIG, CardType } from '../game/types';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Coins, Shield, Zap, BookOpen } from 'lucide-react';

const cardInfo: Record<CardType, { name: string; desc: string; icon: React.ReactNode }> = {
  BLOCK: {
    name: 'Block Card',
    desc: 'Skip another player\'s next turn',
    icon: <Shield className="w-6 h-6" />,
  },
  TELEPORT: {
    name: 'Teleport Card',
    desc: 'Instantly move to a random city',
    icon: <Zap className="w-6 h-6" />,
  },
  ANSWER: {
    name: 'Answer Card',
    desc: 'Auto-correct your next quiz answer',
    icon: <BookOpen className="w-6 h-6" />,
  },
};

export const ShopModal: React.FC = () => {
  const { setShowShopModal, getMyPlayer } = useGameStore();
  const myPlayer = getMyPlayer();

  if (!myPlayer) return null;

  const handleBuyStar = () => {
    gameClient.shopAction('BUY_STAR');
  };

  const handleBuyCard = (cardType: CardType) => {
    gameClient.shopAction('BUY_CARD', cardType);
  };

  const handleSkip = () => {
    gameClient.shopAction('SKIP');
    setShowShopModal(false);
  };

  const canAffordStar = myPlayer.coins >= GAME_CONFIG.SHOP_STAR_COST;

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
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">City Shop</h2>
              <p className="text-white/80 text-sm">Buy items with your coins</p>
            </div>
          </div>
        </div>

        {/* Your Balance */}
        <div className="p-4 bg-gray-50 border-b flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-gray-800">{myPlayer.coins}</span>
            <span className="text-gray-500 text-sm">coins</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-gray-800">{myPlayer.stars}/10</span>
            <span className="text-gray-500 text-sm">stars</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Buy Star */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Special Offer
            </h3>
            <div
              className={`p-4 rounded-xl border-2 ${
                canAffordStar ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                    ⭐
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Buy a Star</p>
                    <p className="text-sm text-gray-500">Get closer to winning!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600 flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    {GAME_CONFIG.SHOP_STAR_COST}
                  </p>
                  <button
                    onClick={handleBuyStar}
                    disabled={!canAffordStar}
                    className="mt-2 px-4 py-1.5 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Power Cards
            </h3>
            <div className="space-y-3">
              {(Object.keys(cardInfo) as CardType[]).map((cardType) => {
                const card = cardInfo[cardType];
                const cost = GAME_CONFIG.CARD_COSTS[cardType];
                const canAfford = myPlayer.coins >= cost;

                return (
                  <div
                    key={cardType}
                    className={`p-4 rounded-xl border-2 ${
                      canAfford ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                          {card.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{card.name}</p>
                          <p className="text-xs text-gray-500">{card.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600 flex items-center gap-1 text-sm">
                          <Coins className="w-3 h-3" />
                          {cost}
                        </p>
                        <button
                          onClick={() => handleBuyCard(cardType)}
                          disabled={!canAfford}
                          className="mt-1 px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="w-full mt-6 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Leave Shop
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
