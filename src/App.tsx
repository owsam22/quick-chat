import { useState, useCallback } from 'react';
import { Home } from './pages/Home';
import { Room } from './pages/Room';

type Page = 'home' | 'room';

export function App() {
  const [page, setPage] = useState<Page>('home');
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');

  const handleJoinRoom = useCallback((code: string, name: string) => {
    setRoomCode(code);
    setUsername(name);
    setPage('room');
  }, []);

  const handleLeave = useCallback(() => {
    setRoomCode('');
    setUsername('');
    setPage('home');
  }, []);

  if (page === 'room' && roomCode && username) {
    return <Room roomCode={roomCode} username={username} onLeave={handleLeave} />;
  }

  return <Home onJoinRoom={handleJoinRoom} />;
}
