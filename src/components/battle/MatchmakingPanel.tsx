'use client';

import { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';

import MatchmakingCinematic from '@/components/battle/MatchmakingCinematic';

type Mode = 'code' | 'mcq';
type QueueState = 'idle' | 'queuing' | 'matched';
type CinematicPhase = 'SEARCHING' | 'MATCH_FOUND';

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
  const [phase, setPhase] = useState<CinematicPhase>('SEARCHING');
  const [opponent, setOpponent] = useState<{ username: string; elo: number } | null>(null);
  const [matchPayload, setMatchPayload] = useState<MatchInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const onMatchFoundRef = useRef(onMatchFound);
  const hasTransitionedRef = useRef(false);

  useEffect(() => {
    onMatchFoundRef.current = onMatchFound;
  }, [onMatchFound]);

  // Clean up queue status on window refresh / close / unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socket?.connected && userId) {
        socket.emit('leave_queue', { userId });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (socket?.connected && userId && queueState === 'queuing') {
        socket.emit('leave_queue', { userId });
      }
    };
  }, [socket, userId, queueState]);

  // Auto-transition into match arena after cinematic finishes (2.8 seconds)
  useEffect(() => {
    if (queueState === 'matched' && matchPayload) {
      hasTransitionedRef.current = false;
      const autoJoinTimer = setTimeout(() => {
        if (!hasTransitionedRef.current) {
          hasTransitionedRef.current = true;
          onMatchFoundRef.current(matchPayload);
        }
      }, 2800);
      return () => clearTimeout(autoJoinTimer);
    }
  }, [queueState, matchPayload]);

  useEffect(() => {
    if (!socket) return;

    const handleJoined = () => {
      setQueueState('queuing');
      setPhase('SEARCHING');
      setError(null);
    };

    const handleMatchFound = (payload: MatchInfo) => {
      console.log('[MatchmakingPanel] Match found event:', payload);
      setMatchPayload(payload);
      setOpponent({
        username: payload.opponentUsername || 'Opponent',
        elo: payload.opponentElo || 1000,
      });
      setPhase('MATCH_FOUND');
      setQueueState('matched');
    };

    const handleLeft = () => {
      setQueueState('idle');
      setPhase('SEARCHING');
      setOpponent(null);
      setMatchPayload(null);
    };

    const handleError = (err: { message: string }) => {
      console.log('[MatchmakingPanel] Error event:', err.message);
      if (err.message?.toLowerCase().includes('already in')) {
        // User was already registered in queue, force clean transition into queuing
        setQueueState('queuing');
        setPhase('SEARCHING');
        setError(null);
        return;
      }
      setError(err.message);
      setQueueState('idle');
      setPhase('SEARCHING');
    };

    const handleDisconnect = () => {
      setQueueState('idle');
      setPhase('SEARCHING');
      setOpponent(null);
      setMatchPayload(null);
      setError('Connection lost. Auto-dequeued from battle server.');
    };

    const handleConnect = () => {
      setError(null);
    };

    socket.on('connect', handleConnect);
    socket.on('queue_joined', handleJoined);
    socket.on('match_found', handleMatchFound);
    socket.on('queue_left', handleLeft);
    socket.on('error', handleError);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('queue_joined', handleJoined);
      socket.off('match_found', handleMatchFound);
      socket.off('queue_left', handleLeft);
      socket.off('error', handleError);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  const joinQueue = () => {
    if (!socket?.connected) {
      setError('Server not connected. Please wait a moment...');
      return;
    }
    setError(null);
    setQueueState('queuing');
    setPhase('SEARCHING');
    socket.emit('join_queue', { userId, mode });
  };

  const leaveQueue = () => {
    setQueueState('idle');
    setPhase('SEARCHING');
    setOpponent(null);
    setMatchPayload(null);
    socket?.emit('leave_queue', { userId });
  };

  const handleEnterBattle = () => {
    if (matchPayload && !hasTransitionedRef.current) {
      hasTransitionedRef.current = true;
      onMatchFoundRef.current(matchPayload);
    }
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

      {(queueState === 'queuing' || queueState === 'matched') && (
        <MatchmakingCinematic
          username={username}
          phase={phase}
          opponent={opponent}
          onEnterBattle={handleEnterBattle}
          onCancel={leaveQueue}
        />
      )}
    </div>
  );
}
