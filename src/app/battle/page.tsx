'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import BattleArenaHero from '@/components/battle/BattleArenaHero';
import MatchmakingPanel from '@/components/battle/MatchmakingPanel';
import ActiveMatchView from '@/components/battle/ActiveMatchView';
import { io, Socket } from 'socket.io-client';

interface UserSession {
  userId: string;
  username: string;
}

interface MatchInfo {
  roomId: string;
  opponentId: string;
  opponentUsername: string;
  opponentElo: number;
  mode: 'code' | 'mcq';
}

const ARENA_URL = process.env.NEXT_PUBLIC_BATTLE_ARENA_URL || 'http://localhost:3001';

export default function BattlePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let activeSocket: Socket | null = null;

    fetch('/api/battle/token')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        if (data.token && data.userId) {
          setUser({ userId: data.userId, username: data.username });

          // Initialize Socket.io connection using JWT token
          activeSocket = io(ARENA_URL, {
            auth: { token: data.token },
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
          });
          setSocket(activeSocket);
        }
      })
      .catch((err) => console.log('Auth check:', err.message))
      .finally(() => setLoading(false));

    return () => {
      activeSocket?.disconnect();
    };
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#050508', color: '#fff', paddingTop: '80px', paddingBottom: '40px' }}>
      <Navbar />

      <BattleArenaHero />

      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            Loading Battle Arena...
          </div>
        ) : !user ? (
          <div
            style={{
              maxWidth: '440px',
              margin: '0 auto',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px' }}>
              Sign In Required
            </h3>
            <p style={{ color: '#888', fontSize: '14px', margin: '0 0 20px' }}>
              Please sign in to join matchmaking and enter 1v1 arenas.
            </p>
            <a
              href="/onboarding?mode=login&next=/battle"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: '#7c3aed',
                color: '#fff',
                borderRadius: '6px',
                fontWeight: 'bold',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              Sign In
            </a>
          </div>
        ) : matchInfo ? (
          <ActiveMatchView
            socket={socket}
            matchInfo={matchInfo}
            userId={user.userId}
            username={user.username}
            onLeave={() => setMatchInfo(null)}
          />
        ) : (
          <MatchmakingPanel
            socket={socket}
            userId={user.userId}
            username={user.username}
            onMatchFound={(info) => setMatchInfo(info)}
          />
        )}
      </section>
    </main>
  );
}
