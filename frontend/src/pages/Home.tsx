import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Sparkles } from 'lucide-react';
import { gameClient } from '../game/ws.client';
import { useGameStore } from '../game/store';
import {
  fetchJourneyRequests,
  submitJourneyRequest,
  type JourneyRequest,
} from '../api/journey';

interface JourneyForm {
  name: string;
  email: string;
  destination: string;
  travelers: number;
  travelMonth: string;
  notes: string;
}

const initialJourneyForm: JourneyForm = {
  name: '',
  email: '',
  destination: '',
  travelers: 1,
  travelMonth: '',
  notes: '',
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setPlayerName, isConnected, roomId, playerId } = useGameStore();

  const [playerNameInput, setPlayerNameInput] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [journeyForm, setJourneyForm] = useState<JourneyForm>(initialJourneyForm);
  const [journeyRequests, setJourneyRequests] = useState<JourneyRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [journeyError, setJourneyError] = useState('');
  const [journeySuccess, setJourneySuccess] = useState('');

  React.useEffect(() => {
    if (roomId && playerId) {
      navigate('/lobby');
    }
  }, [roomId, playerId, navigate]);

  React.useEffect(() => {
    if (!isConnected) {
      gameClient.connect().catch(() => {
        setError('Failed to connect to server');
      });
    }
  }, [isConnected]);

  React.useEffect(() => {
    const loadRequests = async () => {
      try {
        const requests = await fetchJourneyRequests();
        setJourneyRequests(requests);
      } catch (loadError) {
        setJourneyError(loadError instanceof Error ? loadError.message : 'Failed to load requests.');
      } finally {
        setIsLoadingRequests(false);
      }
    };

    loadRequests();
  }, []);

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

  const handleJourneyInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setJourneyForm((previous) => ({
      ...previous,
      [name]: name === 'travelers' ? Number(value) : value,
    }));
  };

  const handleJourneySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setJourneyError('');
    setJourneySuccess('');

    if (!journeyForm.name || !journeyForm.email || !journeyForm.destination || !journeyForm.travelMonth || !journeyForm.notes) {
      setJourneyError('Please complete all journey planner fields.');
      return;
    }

    setIsSubmittingRequest(true);
    try {
      const createdRequest = await submitJourneyRequest(journeyForm);
      setJourneyRequests((previous) => [createdRequest, ...previous]);
      setJourneySuccess('Thanks! Your request has been saved on the server.');
      setJourneyForm(initialJourneyForm);
    } catch (submitError) {
      setJourneyError(submitError instanceof Error ? submitError.message : 'Failed to submit request.');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid gap-6 lg:grid-cols-2">
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-white to-green-600 bg-clip-text text-transparent">
              Bharat Yatra
            </h1>
            <p className="text-gray-600 mt-2">Journey across India, learn, and conquer!</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
            {!mode ? (
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

                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-500">
                    {isConnected ? 'Connected to server' : 'Connecting...'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setMode(null);
                    setError('');
                  }}
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

          <div className="text-center mt-6 text-gray-500 text-sm">
            <p>A multiplayer board game to explore Indian culture</p>
            <p className="mt-1">First to collect 10 stars wins!</p>
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100 space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Travel Planner (Full Stack Demo)</h2>
            <p className="text-sm text-gray-600 mt-1">
              Submit your trip preferences and see all saved requests from the backend API.
            </p>
          </div>

          <form onSubmit={handleJourneySubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              value={journeyForm.name}
              onChange={handleJourneyInputChange}
              placeholder="Full name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <input
              type="email"
              name="email"
              value={journeyForm.email}
              onChange={handleJourneyInputChange}
              placeholder="Email"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                name="destination"
                value={journeyForm.destination}
                onChange={handleJourneyInputChange}
                placeholder="Destination city"
                className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="number"
                name="travelers"
                min={1}
                max={20}
                value={journeyForm.travelers}
                onChange={handleJourneyInputChange}
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <input
              type="text"
              name="travelMonth"
              value={journeyForm.travelMonth}
              onChange={handleJourneyInputChange}
              placeholder="Preferred month"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <textarea
              name="notes"
              rows={3}
              value={journeyForm.notes}
              onChange={handleJourneyInputChange}
              placeholder="Tell us what experience you want"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            {journeyError && <p className="text-sm text-red-600">{journeyError}</p>}
            {journeySuccess && <p className="text-sm text-green-600">{journeySuccess}</p>}

            <button
              type="submit"
              disabled={isSubmittingRequest}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {isSubmittingRequest ? 'Saving...' : 'Save Journey Request'}
            </button>
          </form>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent requests</h3>
            {isLoadingRequests ? (
              <p className="text-sm text-gray-500">Loading requests...</p>
            ) : journeyRequests.length === 0 ? (
              <p className="text-sm text-gray-500">No requests yet.</p>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {journeyRequests.map((request) => (
                  <li key={request.id} className="border border-gray-200 rounded-xl p-3 bg-white">
                    <p className="font-medium text-gray-800">
                      {request.name} → {request.destination} ({request.travelMonth})
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.travelers} traveler(s) · {request.email}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{request.notes}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
