import { useState } from 'react';
import { gameClient } from '../game/ws.client';
import { useGameStore } from '../game/store';
import type { Player, TurnPhase, CardType } from '../game/types';
import { getNode } from '../game/constants';
import { Dice6, ArrowRight, Zap, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionPanelProps {
  turnPhase: TurnPhase;
  diceValue: number | null;
  remainingMoves: number;
  isMyTurn: boolean;
  myPlayer: Player | null;
}

const cardDescriptions: Record<CardType, { name: string; desc: string; icon: string }> = {
  BLOCK: { name: 'Block Card', desc: 'Skip another player\'s turn', icon: '🛡️' },
  TELEPORT: { name: 'Teleport Card', desc: 'Move to a random city', icon: '✨' },
  ANSWER: { name: 'Answer Card', desc: 'Auto-correct next quiz', icon: '📚' },
};

export const ActionPanel: React.FC<ActionPanelProps> = ({
  turnPhase,
  diceValue,
  remainingMoves,
  isMyTurn,
  myPlayer,
}) => {
  const { gameState } = useGameStore();
  const [showCards, setShowCards] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showTargetSelect, setShowTargetSelect] = useState(false);

  const handleRollDice = () => {
    gameClient.rollDice();
  };

  const handleEndTurn = () => {
    gameClient.endTurn();
  };

  const handleLearnRegion = () => {
    if (myPlayer) {
      gameClient.learnRegion(myPlayer.currentNodeId);
    }
  };

  const handleUseCard = (cardId: string, cardType: CardType) => {
    if (cardType === 'BLOCK') {
      setSelectedCard(cardId);
      setShowTargetSelect(true);
    } else {
      gameClient.useCard(cardId);
    }
  };

  const handleSelectTarget = (targetPlayerId: string) => {
    if (selectedCard) {
      gameClient.useCard(selectedCard, targetPlayerId);
      setSelectedCard(null);
      setShowTargetSelect(false);
    }
  };

  const currentNode = myPlayer ? getNode(myPlayer.currentNodeId) : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex-1 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Actions</h2>

      {/* Turn Status */}
      <div className={`p-3 rounded-xl mb-4 ${
        isMyTurn ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
      }`}>
        {isMyTurn ? (
          <div>
            <p className="text-green-700 font-medium">
              {turnPhase === 'WAITING_FOR_ROLL' && "Roll the dice to move!"}
              {turnPhase === 'MOVING' && "Click on a highlighted city to travel there!"}
              {turnPhase === 'QUIZ' && "Answer the quiz!"}
              {turnPhase === 'FAIRY_INTERACTION' && "You found the Fairy!"}
              {turnPhase === 'SHOP' && "Welcome to the Shop!"}
              {turnPhase === 'TURN_ENDED' && "Click End Turn to continue"}
            </p>
            {currentNode && (
              <p className="text-sm text-gray-500 mt-1">
                Location: {currentNode.name}, {currentNode.region}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Waiting for other player...</p>
        )}
      </div>

      {/* Dice Display */}
      {diceValue && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center gap-2 mb-4 p-4 bg-orange-50 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-3xl font-bold text-orange-600 border-2 border-orange-200">
              {diceValue}
            </div>
            <div className="text-left">
              <p className="text-orange-700 font-medium">You rolled a {diceValue}!</p>
              <p className="text-sm text-orange-600">
                {remainingMoves > 0
                  ? `Travel up to ${remainingMoves} cities away`
                  : 'Select your destination'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 flex-1">
        {isMyTurn && turnPhase === 'WAITING_FOR_ROLL' && (
          <button
            onClick={handleRollDice}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
          >
            <Dice6 className="w-5 h-5" />
            Roll Dice
          </button>
        )}

        {isMyTurn && turnPhase === 'TURN_ENDED' && (
          <button
            onClick={handleEndTurn}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md"
          >
            <ArrowRight className="w-5 h-5" />
            End Turn
          </button>
        )}

        {/* Learn About Region */}
        {myPlayer && (
          <button
            onClick={handleLearnRegion}
            className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 px-4 rounded-xl hover:bg-blue-100 transition-all border border-blue-200"
          >
            <BookOpen className="w-4 h-4" />
            Learn About This Region
          </button>
        )}
      </div>

      {/* My Cards */}
      {myPlayer && myPlayer.cards.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowCards(!showCards)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-700">My Cards ({myPlayer.cards.length})</span>
            <Zap className="w-4 h-4 text-purple-500" />
          </button>

          <AnimatePresence>
            {showCards && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-2 overflow-hidden"
              >
                {myPlayer.cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between p-2 bg-purple-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span>{cardDescriptions[card.type].icon}</span>
                      <div>
                        <p className="text-sm font-medium">{cardDescriptions[card.type].name}</p>
                        <p className="text-xs text-gray-500">{cardDescriptions[card.type].desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUseCard(card.id, card.type)}
                      className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Target Selection for Block Card */}
      <AnimatePresence>
        {showTargetSelect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Select Target Player</h3>
                <button onClick={() => setShowTargetSelect(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {gameState?.players
                  .filter(p => p.id !== myPlayer?.id)
                  .map(player => (
                    <button
                      key={player.id}
                      onClick={() => handleSelectTarget(player.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-200"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: player.color }}
                      >
                        {player.name.charAt(0)}
                      </div>
                      <span>{player.name}</span>
                    </button>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
