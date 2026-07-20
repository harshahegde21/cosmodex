'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
}

export default function Leaderboard() {
  const [mode, setMode] = useState<'code' | 'mcq'>('code');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleModeChange = (newMode: 'code' | 'mcq') => {
    if (newMode !== mode) {
      setMode(newMode);
      setLoading(true);
      setError(null);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReloadTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    let ignore = false;

    fetch(`/api/battle/leaderboard?mode=${mode}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load leaderboard');
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          if (Array.isArray(data)) {
            setEntries(data);
          } else {
            setError(data.error || 'Failed to load leaderboard data');
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('[Leaderboard Error]', err);
          setError(err.message || 'Error connecting to server');
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [mode, reloadTrigger]);

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Leaderboard</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleModeChange('code')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid #333',
              background: mode === 'code' ? '#7c3aed' : '#111',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Code Battle
          </button>
          <button
            onClick={() => handleModeChange('mcq')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid #333',
              background: mode === 'mcq' ? '#7c3aed' : '#111',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            MCQ Battle
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Loading leaderboard...</div>
      ) : error ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#f87171', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid #ef4444' }}>
          <p style={{ margin: '0 0 12px' }}>{error}</p>
          <button
            onClick={handleRetry}
            style={{ padding: '6px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Retry
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#888' }}>No leaderboard entries found</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#eee' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', color: '#aaa' }}>
              <th style={{ padding: '10px' }}>Rank</th>
              <th style={{ padding: '10px' }}>User</th>
              <th style={{ padding: '10px' }}>ELO</th>
              <th style={{ padding: '10px' }}>W / L / D</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.userId || entry.rank} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>#{entry.rank}</td>
                <td style={{ padding: '10px' }}>{entry.username || 'Anonymous'}</td>
                <td style={{ padding: '10px', color: '#a78bfa', fontWeight: 'bold' }}>{entry.elo}</td>
                <td style={{ padding: '10px' }}>
                  {entry.wins}W - {entry.losses}L - {entry.draws}D
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
