import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameClient } from '../game/ws.client';
import { useGameStore } from '../game/store';
import { MapPin, Users, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setPlayerName, isConnected, roomId, playerId } = useGameStore();

  const [playerNameInput, setPlayerNameInput] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Navigate to lobby when room is created/joined
  React.useEffect(() => {
    if (roomId && playerId) {
      navigate('/lobby');
    }
  }, [roomId, playerId, navigate]);

  // Connect to WebSocket on mount
  React.useEffect(() => {
    if (!isConnected) {
      gameClient.connect().catch(() => {
        setError('Failed to connect to server');
      });
    }
  }, [isConnected]);

  const handleCreateRoom = async () => {
    if (!playerNameInput.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!roomIdInput.trim()) {
      setError('Please enter a room name');
      return;
    }

    setIsLoading(true);
    setError('');
    setPlayerName(playerNameInput);
    gameClient.createRoom(roomIdInput, playerNameInput);

    // Wait a bit for the response
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleJoinRoom = async () => {
    if (!playerNameInput.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!roomIdInput.trim()) {
      setError('Please enter a room code');
      return;
    }

    setIsLoading(true);
    setError('');
    setPlayerName(playerNameInput);
    gameClient.joinRoom(roomIdInput, playerNameInput);

    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-white to-green-600 bg-clip-text text-transparent">
            Bharat Yatra
          </h1>
          <p className="text-gray-600 mt-2">Journey across India, learn, and conquer!</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
          {!mode ? (
            // Mode Selection
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
                Start Your Adventure
              </h2>

              <button
                onClick={() => setMode('create')}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                Create New Room
              </button>

              <button
                onClick={() => setMode('join')}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-4 px-6 rounded-xl font-semibold border-2 border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-all"
              >
                <Users className="w-5 h-5" />
                Join Existing Room
              </button>

              {/* Connection Status */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-500">
                  {isConnected ? 'Connected to server' : 'Connecting...'}
                </span>
              </div>
            </div>
          ) : (
            // Room Form
            <div className="space-y-4">
              <button
                onClick={() => { setMode(null); setError(''); }}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
              >
                ← Back
              </button>

              <h2 className="text-xl font-semibold text-gray-800">
                {mode === 'create' ? 'Create a Room' : 'Join a Room'}
              </h2>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={playerNameInput}
                    onChange={(e) => setPlayerNameInput(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {mode === 'create' ? 'Room Name' : 'Room Code'}
                  </label>
                  <input
                    type="text"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    placeholder={mode === 'create' ? 'Choose a room name' : 'Enter room code'}
                    maxLength={30}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <button
                onClick={mode === 'create' ? handleCreateRoom : handleJoinRoom}
                disabled={isLoading || !isConnected}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : mode === 'create' ? 'Create Room' : 'Join Room'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>A multiplayer board game to explore Indian culture</p>
          <p className="mt-1">First to collect 10 stars wins!</p>
        </div>
      </div>
    </div>
  );
};
