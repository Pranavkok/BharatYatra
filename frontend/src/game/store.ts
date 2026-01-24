import { create } from 'zustand';
import type { GameState, Player, Quiz } from './types';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface GameStore {
  // Connection state
  isConnected: boolean;
  setConnected: (connected: boolean) => void;

  // Player identity
  playerId: string | null;
  playerName: string;
  setPlayerId: (id: string | null) => void;
  setPlayerName: (name: string) => void;

  // Room state
  roomId: string | null;
  setRoomId: (id: string | null) => void;

  // Game state
  gameState: GameState | null;
  setGameState: (state: GameState | null) => void;

  // Current quiz
  currentQuiz: Quiz | null;
  setCurrentQuiz: (quiz: Quiz | null) => void;

  // Dice state
  diceValue: number | null;
  validMoves: string[];
  setDiceRoll: (value: number | null, moves: string[]) => void;

  // UI state
  showQuizModal: boolean;
  showFairyModal: boolean;
  showShopModal: boolean;
  showGameOverModal: boolean;
  showRegionInfo: { nodeId: string; nodeName: string; info: string } | null;

  setShowQuizModal: (show: boolean) => void;
  setShowFairyModal: (show: boolean) => void;
  setShowShopModal: (show: boolean) => void;
  setShowGameOverModal: (show: boolean) => void;
  setShowRegionInfo: (info: { nodeId: string; nodeName: string; info: string } | null) => void;

  // Game over state
  gameOverData: {
    winnerId: string;
    winnerName: string;
    finalScores: { playerId: string; name: string; stars: number; coins: number }[];
  } | null;
  setGameOverData: (data: GameStore['gameOverData']) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;

  // Quiz result
  lastQuizResult: { correct: boolean; coinsChange: number } | null;
  setLastQuizResult: (result: GameStore['lastQuizResult']) => void;

  // Helpers
  getMyPlayer: () => Player | null;
  isMyTurn: () => boolean;
  getCurrentPlayer: () => Player | null;

  // Reset
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Connection state
  isConnected: false,
  setConnected: (connected) => set({ isConnected: connected }),

  // Player identity
  playerId: null,
  playerName: '',
  setPlayerId: (id) => set({ playerId: id }),
  setPlayerName: (name) => set({ playerName: name }),

  // Room state
  roomId: null,
  setRoomId: (id) => set({ roomId: id }),

  // Game state
  gameState: null,
  setGameState: (state) => set({ gameState: state }),

  // Quiz
  currentQuiz: null,
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),

  // Dice
  diceValue: null,
  validMoves: [],
  setDiceRoll: (value, moves) => set({ diceValue: value, validMoves: moves }),

  // UI state
  showQuizModal: false,
  showFairyModal: false,
  showShopModal: false,
  showGameOverModal: false,
  showRegionInfo: null,

  setShowQuizModal: (show) => set({ showQuizModal: show }),
  setShowFairyModal: (show) => set({ showFairyModal: show }),
  setShowShopModal: (show) => set({ showShopModal: show }),
  setShowGameOverModal: (show) => set({ showGameOverModal: show }),
  setShowRegionInfo: (info) => set({ showRegionInfo: info }),

  // Game over data
  gameOverData: null,
  setGameOverData: (data) => set({ gameOverData: data }),

  // Notifications
  notifications: [],
  addNotification: (type, message) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }],
    }));
    // Auto remove after 4 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 4000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // Quiz result
  lastQuizResult: null,
  setLastQuizResult: (result) => set({ lastQuizResult: result }),

  // Helpers
  getMyPlayer: () => {
    const { gameState, playerId } = get();
    if (!gameState || !playerId) return null;
    return gameState.players.find((p) => p.id === playerId) || null;
  },

  isMyTurn: () => {
    const { gameState, playerId } = get();
    if (!gameState || !playerId) return false;
    const player = gameState.players.find((p) => p.id === playerId);
    return player?.isTurn || false;
  },

  getCurrentPlayer: () => {
    const { gameState } = get();
    if (!gameState) return null;
    return gameState.players[gameState.currentTurnIndex] || null;
  },

  // Reset
  reset: () =>
    set({
      playerId: null,
      roomId: null,
      gameState: null,
      currentQuiz: null,
      diceValue: null,
      validMoves: [],
      showQuizModal: false,
      showFairyModal: false,
      showShopModal: false,
      showGameOverModal: false,
      showRegionInfo: null,
      gameOverData: null,
      notifications: [],
      lastQuizResult: null,
    }),
}));
