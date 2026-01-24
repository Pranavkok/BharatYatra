import React from 'react';
import { useGameStore } from '../game/store';
import { gameClient } from '../game/ws.client';
import { getNode } from '../game/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MapPin, Sparkles } from 'lucide-react';

export const LearningModal: React.FC = () => {
  const {
    showLearningModal,
    learningData,
    setShowLearningModal,
    isMyTurn
  } = useGameStore();

  const iAmCurrentPlayer = isMyTurn();

  if (!showLearningModal || !learningData) return null;

  const node = getNode(learningData.nodeId);

  const handleContinue = () => {
    setShowLearningModal(false);
    // End turn after viewing learning content
    if (iAmCurrentPlayer) {
      gameClient.endTurn();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Left Side - Lady Image */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full md:w-2/5 bg-gradient-to-br from-orange-100 to-amber-50 relative flex items-end justify-center"
          >
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md">
                <div className="flex items-center gap-2 text-orange-600">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">Explore & Learn!</span>
                </div>
              </div>
            </div>

            <img
              src="/asset/lady.png"
              alt="Guide"
              className="max-h-[400px] object-contain drop-shadow-lg"
              onError={(e) => {
                // Hide image if not found
                e.currentTarget.style.display = 'none';
              }}
            />

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-200/50 to-transparent" />
          </motion.div>

          {/* Right Side - Region Information */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full md:w-3/5 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{node?.name || learningData.nodeName}</h2>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {node?.region || 'India'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Quiz Result Banner */}
                {learningData.quizResult && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-xl ${
                      learningData.quizResult.correct
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl ${
                        learningData.quizResult.correct ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {learningData.quizResult.correct ? '🎉' : '📚'}
                      </div>
                      <div>
                        <p className={`font-medium ${
                          learningData.quizResult.correct ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {learningData.quizResult.correct
                            ? 'Great job! You answered correctly!'
                            : 'Keep learning! Here\'s more about this place:'}
                        </p>
                        <p className={`text-sm ${
                          learningData.quizResult.correct ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {learningData.quizResult.coinsChange > 0 ? '+' : ''}
                          {learningData.quizResult.coinsChange} coins
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Region Information */}
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-5 border border-slate-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">🏛️</span>
                    About {node?.name || learningData.nodeName}
                  </h3>

                  {learningData.info ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {learningData.info}
                    </p>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                      <span className="ml-3 text-gray-500">Loading information...</span>
                    </div>
                  )}
                </div>

                {/* Fun Facts Section */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <div className="text-2xl mb-1">🎭</div>
                    <p className="text-sm font-medium text-amber-800">Culture & Traditions</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <div className="text-2xl mb-1">🍛</div>
                    <p className="text-sm font-medium text-emerald-800">Local Cuisine</p>
                  </div>
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                    <div className="text-2xl mb-1">🎪</div>
                    <p className="text-sm font-medium text-sky-800">Festivals</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <div className="text-2xl mb-1">🏰</div>
                    <p className="text-sm font-medium text-purple-800">Landmarks</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={handleContinue}
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>Continue Journey</span>
                <span className="text-xl">🚀</span>
              </button>
              {!iAmCurrentPlayer && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Waiting for current player to continue...
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
