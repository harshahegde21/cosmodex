'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ScrollText, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface Match {
  id: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  player1_score: number;
  player2_score: number;
  player1: { username: string; email: string };
  player2: { username: string; email: string };
  winner: { username: string } | null;
}

interface MatchesResponse {
  matches: Match[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_COLORS: Record<string, string> = {
  in_progress: '#F5A623',
  completed: '#3DCB7F',
  cancelled: '#E85D5D',
  draw: '#4ECDC4',
};

export default function ArenaMatchesPage() {
  const [data, setData] = useState<MatchesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/arena/matches?${params}`);
      if (res.ok) setData(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams({ page: String(page) });
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/admin/arena/matches?${params}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json) setData(json);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, statusFilter]);

  const formatDuration = (start: string, end: string | null) => {
    if (!end) return 'Ongoing';
    const diff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    return `${Math.floor(diff / 60)}m ${diff % 60}s`;
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1"><ScrollText size={20} className="text-[#E873C3]" /><h1 className="text-2xl font-black text-white">Match Monitor</h1></div>
            <p className="text-sm text-white/40">View all past and ongoing battle matches with score details.</p>
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-[#E873C3] transition-all">
              <option value="" className="bg-[#0c0818]">All Status</option>
              <option value="in_progress" className="bg-[#0c0818]">In Progress</option>
              <option value="completed" className="bg-[#0c0818]">Completed</option>
              <option value="cancelled" className="bg-[#0c0818]">Cancelled</option>
            </select>
            <button onClick={fetchMatches} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/70 hover:text-white transition-all"><RefreshCw size={14} /></button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {['Players', 'Score', 'Status', 'Winner', 'Duration', 'Started'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold text-white/30 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <tr key={i} className="border-b border-white/[0.04]">{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-white/[0.05] rounded animate-pulse" /></td>)}</tr>)
                ) : data?.matches.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-white/30 text-sm">No matches found.</td></tr>
                ) : (
                  data?.matches.map((match) => {
                    const sc = STATUS_COLORS[match.status] ?? '#A9A8BE';
                    return (
                      <tr key={match.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-white font-semibold">{match.player1.username}</span>
                            <span className="text-white/40 text-xs">vs</span>
                            <span className="text-white font-semibold">{match.player2.username}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-white">{match.player1_score} — {match.player2_score}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize" style={{ background: `${sc}18`, color: sc }}>
                            {match.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-white/60 text-sm">{match.winner?.username ?? '—'}</td>
                        <td className="px-5 py-4 text-white/40 text-sm">{formatDuration(match.started_at, match.ended_at)}</td>
                        <td className="px-5 py-4 text-white/40 text-xs whitespace-nowrap">{new Date(match.started_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.07]">
              <span className="text-xs text-white/40">{data.total} matches total</span>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft size={16} /></button>
                <span className="text-xs text-white/60 px-2">Page {page} of {data.totalPages}</span>
                <button disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
