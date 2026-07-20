'use client';

import { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';

type Mode = 'code' | 'mcq';
type QueueState = 'idle' | 'queuing' | 'matched';

interface MatchInfo {
  roomId: string;
  opponentId: string;
  opponentUsername: string;
  opponentElo: number;
  mode: Mode;
}

interface Props {
  socket: Socket | null;
  userId: string;
  username: string;
  onMatchFound: (info: MatchInfo) => void;
}

export default function MatchmakingPanel({ socket, userId, username, onMatchFound }: Props) {
  const [mode, setMode] = useState<Mode>('code');
  const [queueState, setQueueState] = useState<QueueState>('idle');
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onMatchFoundRef = useRef(onMatchFound);

  useEffect(() => {
    onMatchFoundRef.current = onMatchFound;
  }, [onMatchFound]);

  useEffect(() => {
    if (!socket) return;

    const handleJoined = (payload?: { message?: string }) => {
      setQueueState('queuing');
      setWaitSeconds(0);
      if (payload?.message) {
        setStatusMessage(payload.message);
      }
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setWaitSeconds((s) => s + 1), 1000);
    };

    const handleMatchFound = (payload: MatchInfo) => {
      setQueueState('matched');
      if (timerRef.current) clearInterval(timerRef.current);
      onMatchFoundRef.current(payload);
    };

    const handleLeft = () => {
      setQueueState('idle');
      setStatusMessage(null);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleError = (err: { message: string }) => {
      setError(err.message);
      setQueueState('idle');
      if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleDisconnect = () => {
      setQueueState('idle');
      setStatusMessage(null);
      if (timerRef.current) clearInterval(timerRef.current);
      setError('Connection to server lost. Reconnecting...');
    };

    socket.on('queue_joined', handleJoined);
    socket.on('match_found', handleMatchFound);
    socket.on('queue_left', handleLeft);
    socket.on('error', handleError);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('queue_joined', handleJoined);
      socket.off('match_found', handleMatchFound);
      socket.off('queue_left', handleLeft);
      socket.off('error', handleError);
      socket.off('disconnect', handleDisconnect);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [socket]);

  const joinQueue = () => {
    if (!socket?.connected) {
      setError('Server not connected. Please wait a moment...');
      return;
    }
    setError(null);
    socket.emit('join_queue', { userId, mode });
  };

  const leaveQueue = () => {
    setQueueState('idle');
    setStatusMessage(null);
    if (timerRef.current) clearInterval(timerRef.current);
    socket?.emit('leave_queue', { userId });
  };

  return (
    <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px' }}>Find a Match</h2>
      <p style={{ color: '#888', fontSize: '14px', margin: '0 0 16px' }}>Playing as {username}</p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setMode('code')}
          disabled={queueState === 'queuing'}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #333',
            background: mode === 'code' ? '#7c3aed' : '#222',
            color: '#fff',
            fontWeight: 600,
            cursor: queueState === 'queuing' ? 'not-allowed' : 'pointer',
          }}
        >
          Code Battle
        </button>
        <button
          onClick={() => setMode('mcq')}
          disabled={queueState === 'queuing'}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #333',
            background: mode === 'mcq' ? '#7c3aed' : '#222',
            color: '#fff',
            fontWeight: 600,
            cursor: queueState === 'queuing' ? 'not-allowed' : 'pointer',
          }}
        >
          MCQ Battle
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {queueState === 'idle' && (
        <button
          onClick={joinQueue}
          style={{
            width: '100%',
            padding: '12px',
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          Join Match Queue
        </button>
      )}

      {queueState === 'queuing' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
          <style>{`
            @keyframes radarSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes radarPulse {
              0% { transform: scale(0.4); opacity: 0.8; }
              100% { transform: scale(1.15); opacity: 0; }
            }
          `}</style>
          <div
            style={{
              position: 'relative',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(15,15,25,0.95) 75%)',
              border: '2px solid rgba(124,58,237,0.5)',
              boxShadow: '0 0 30px rgba(124, 58, 237, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              overflow: 'hidden',
            }}
          >
            {/* Concentric radar grid lines */}
            <div style={{ position: 'absolute', width: '110px', height: '110px', borderRadius: '50%', border: '1px dashed rgba(167,139,250,0.3)' }} />
            <div style={{ position: 'absolute', width: '60px', height: '60px', borderRadius: '50%', border: '1px dashed rgba(167,139,250,0.3)' }} />
            <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(124,58,237,0.2)' }} />
            <div style={{ position: 'absolute', width: '1px', height: '100%', background: 'rgba(124,58,237,0.2)' }} />

            {/* Pulsing ring animation */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid #7c3aed',
                animation: 'radarPulse 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
              }}
            />

            {/* Rotating radar sweep */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, transparent 0deg 270deg, rgba(124,58,237,0.6) 360deg)',
                animation: 'radarSpin 2.2s linear infinite',
              }}
            />

            {/* Center avatar/badge */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#111',
                border: '2px solid #a78bfa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#fff',
                boxShadow: '0 0 15px rgba(124,58,237,0.6)',
              }}
            >
              {username ? username.substring(0, 2).toUpperCase() : 'VS'}
            </div>
          </div>

          <p style={{ color: '#fff', fontWeight: 600, fontSize: '16px', margin: '0 0 4px' }}>
            Searching for Opponent...
          </p>
          <p style={{ color: '#a78bfa', fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace', margin: '0 0 8px' }}>
            {formatTime(waitSeconds)}
          </p>
          {statusMessage && (
            <p style={{ color: '#888', fontSize: '13px', margin: '0 0 16px', textAlign: 'center', maxWidth: '320px' }}>
              {statusMessage}
            </p>
          )}

          <button
            onClick={leaveQueue}
            style={{
              padding: '8px 24px',
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              border: '1px solid #ef4444',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              marginTop: '4px',
            }}
          >
            Cancel Match Search
          </button>
        </div>
      )}

      {queueState === 'matched' && (
        <div style={{ textAlign: 'center', color: '#4ade80', fontWeight: 'bold', padding: '16px' }}>
          ⚔️ Match Found! Entering Arena...
        </div>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
