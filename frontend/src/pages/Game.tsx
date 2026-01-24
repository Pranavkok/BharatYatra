import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/store';
import { gameClient } from '../game/ws.client';
import { IndiaMap } from '../components/IndiaMap';
import { PlayerPanel } from '../components/PlayerPanel';
import { ActionPanel } from '../components/ActionPanel';
import { QuizModal } from '../components/QuizModal';
import { FairyModal } from '../components/FairyModal';
import { ShopModal } from '../components/ShopModal';
import { GameOverModal } from '../components/GameOverModal';
import { RegionInfoModal } from '../components/RegionInfoModal';
import { Notifications } from '../components/Notifications';
import { Star, Coins, MapPin } from 'lucide-react';

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const {
    gameState,
    roomId,
    playerId,
    diceValue,
    validMoves,
    showQuizModal,
    showFairyModal,
    showShopModal,
    showGameOverModal,
    showRegionInfo,
    getMyPlayer,
    isMyTurn,
    getCurrentPlayer,
  } = useGameStore();

  // Redirect if not in a game
  useEffect(() => {
    if (!roomId || !playerId) {
      navigate('/');
    }
  }, [roomId, playerId, navigate]);

  // Redirect to home if game is not in playing state
  useEffect(() => {
    if (gameState && gameState.status === 'WAITING') {
      navigate('/lobby');
    }
  }, [gameState?.status, navigate]);

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  const myPlayer = getMyPlayer();
  const currentPlayer = getCurrentPlayer();

  const handleNodeClick = (nodeId: string) => {
    if (!isMyTurn() || gameState.turnPhase !== 'MOVING') return;
    if (!validMoves.includes(nodeId)) return;
    gameClient.movePlayer(nodeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800">Bharat Yatra</span>
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
              Room: {roomId?.slice(0, 8)}
            </span>
          </div>

          {/* Turn Indicator */}
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            isMyTurn()
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isMyTurn() ? "Your Turn!" : `${currentPlayer?.name}'s Turn`}
          </div>

          {/* My Stats */}
          {myPlayer && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-yellow-700">{myPlayer.stars}/10</span>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-amber-700">{myPlayer.coins}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        <div className="flex gap-4 h-full">
          {/* Left Side - Map */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
            <IndiaMap
              players={gameState.players}
              fairyNodeId={gameState.fairyNodeId}
              treasureNodeIds={gameState.treasureNodeIds}
              shopNodeIds={gameState.shopNodeIds}
              validMoves={isMyTurn() && gameState.turnPhase === 'MOVING' ? validMoves : []}
              currentPlayerId={playerId}
              onNodeClick={handleNodeClick}
            />
          </div>

          {/* Right Side - Panels */}
          <div className="w-80 flex flex-col gap-4">
            {/* Players Panel */}
            <PlayerPanel
              players={gameState.players}
              currentPlayerId={playerId}
              currentTurnIndex={gameState.currentTurnIndex}
            />

            {/* Action Panel */}
            <ActionPanel
              turnPhase={gameState.turnPhase}
              diceValue={diceValue}
              remainingMoves={gameState.remainingMoves}
              isMyTurn={isMyTurn()}
              myPlayer={myPlayer}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showQuizModal && <QuizModal />}
      {showFairyModal && <FairyModal />}
      {showShopModal && <ShopModal />}
      {showGameOverModal && <GameOverModal />}
      {showRegionInfo && <RegionInfoModal />}

      {/* Notifications */}
      <Notifications />
    </div>
  );
};
