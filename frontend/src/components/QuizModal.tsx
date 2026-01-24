import { useState } from 'react';
import { useGameStore } from '../game/store';
import { gameClient } from '../game/ws.client';
import { getNode } from '../game/constants';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, XCircle } from 'lucide-react';

export const QuizModal: React.FC = () => {
  const { currentQuiz, lastQuizResult, playerId } = useGameStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  if (!currentQuiz) return null;

  const isMyQuiz = currentQuiz.playerId === playerId;
  const node = getNode(currentQuiz.nodeId);

  const handleAnswer = (index: number) => {
    if (hasAnswered || !isMyQuiz) return;
    setSelectedAnswer(index);
    setHasAnswered(true);
    gameClient.answerQuiz(index);
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
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Quiz Time!</h2>
              {node && (
                <p className="text-white/80 text-sm">
                  {node.name}, {node.region}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Question */}
          <p className="text-lg font-medium text-gray-800 mb-6">
            {currentQuiz.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQuiz.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuiz.correctIndex;
              const showResult = hasAnswered && lastQuizResult;

              let buttonStyle = 'bg-gray-50 hover:bg-gray-100 border-gray-200';
              if (showResult) {
                if (isCorrect) {
                  buttonStyle = 'bg-green-50 border-green-500 text-green-700';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'bg-red-50 border-red-500 text-red-700';
                }
              } else if (isSelected) {
                buttonStyle = 'bg-indigo-50 border-indigo-500';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={hasAnswered || !isMyQuiz}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${buttonStyle} ${
                    !hasAnswered && isMyQuiz ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </span>
                  {showResult && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result */}
          {hasAnswered && lastQuizResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl text-center ${
                lastQuizResult.correct ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              {lastQuizResult.correct ? (
                <p className="text-green-700 font-medium">
                  Correct! +{lastQuizResult.coinsChange} coins
                </p>
              ) : (
                <p className="text-red-700 font-medium">
                  Wrong! {lastQuizResult.coinsChange} coins
                </p>
              )}
            </motion.div>
          )}

          {/* Waiting for other player */}
          {!isMyQuiz && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center text-gray-600">
              Waiting for player to answer...
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
