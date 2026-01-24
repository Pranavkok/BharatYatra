import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Lobby } from './pages/Lobby';
import { Game } from './pages/Game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
