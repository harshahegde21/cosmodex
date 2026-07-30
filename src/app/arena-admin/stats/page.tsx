'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { TrendingUp, Search, ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';

interface UserStats {
  id: string;
  user_id: string;
  elo_rating: number;
  mcq_elo_rating: number;
  wins: number;
  losses: number;
  draws: number;
  users: { username: string; email: string; is_active: boolean } | null;
}

interface StatsResponse {
  stats: UserStats[];
  total: number;
  page: number;
  totalPages: number;
}

interface EloModal {
  stat: UserStats;
  elo: number;
  mcqElo: number;
  reason: string;
}

export default function ArenaStatsPage() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<EloModal | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/arena/stats?${params}`);
      if (res.ok) setData(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set('search', search);

    fetch(`/api/admin/arena/stats?${params}`)
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
  }, [page, search]);

  const openModal = (stat: UserStats) => setModal({ stat, elo: stat.elo_rating, mcqElo: stat.mcq_elo_rating, reason: '' });
  const closeModal = () => { setModal(null); setModalError(''); setModalSuccess(''); };

  const handleEloUpdate = async () => {
    if (!modal) return;
    setModalLoading(true);
    setModalError('');
    try {
      const res = await fetch('/api/admin/arena/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: modal.stat.user_id, elo_rating: modal.elo, mcq_elo_rating: modal.mcqElo, reason: modal.reason }),
      });
      const json = await res.json();
      if (!res.ok) { setModalError(json.error ?? 'Failed'); }
      else { setModalSuccess('ELO updated successfully.'); setTimeout(() => { closeModal(); fetchStats(); }, 800); }
    } catch { setModalError('Network error.'); }
    finally { setModalLoading(false); }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#F5C842';
    if (rank === 2) return '#A9A8BE';
    if (rank === 3) return '#FF6B35';
    return '#4B4B6B';
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1"><TrendingUp size={20} className="text-[#4ECDC4]" /><h1 className="text-2xl font-black text-white">ELO Ladder</h1></div>
            <p className="text-sm text-white/40">View battle ELO rankings and manually adjust ratings with justification.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search user…" className="pl-10 pr-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#4ECDC4] transition-all w-44" />
            </div>
            <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/70 hover:text-white transition-all"><RefreshCw size={14} /></button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {['Rank', 'Player', 'Code ELO', 'MCQ ELO', 'W / L / D', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold text-white/30 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => <tr key={i} className="border-b border-white/[0.04]">{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-white/[0.05] rounded animate-pulse" /></td>)}</tr>)
                ) : data?.stats.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-white/30 text-sm">No players on the ladder yet.</td></tr>
                ) : (
                  data?.stats.map((stat, index) => {
                    const rank = (page - 1) * 20 + index + 1;
                    const rankColor = getRankColor(rank);
                    return (
                      <tr key={stat.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <span className="text-lg font-black" style={{ color: rankColor }}>#{rank}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#C0392B] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {stat.users?.username.slice(0, 2).toUpperCase() ?? '??'}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{stat.users?.username ?? 'Unknown'}</p>
                              <p className="text-[11px] text-white/40">{stat.users?.email ?? '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-[#4ECDC4] text-base">{stat.elo_rating}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-[#F5A623] text-base">{stat.mcq_elo_rating}</span>
                        </td>
                        <td className="px-5 py-4 text-white/60 font-mono text-sm">
                          <span className="text-green-400">{stat.wins}W</span> / <span className="text-red-400">{stat.losses}L</span> / <span className="text-white/40">{stat.draws}D</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.users?.is_active ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                            {stat.users?.is_active ? 'Active' : 'Banned'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => openModal(stat)} className="px-3 py-1.5 rounded-lg bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 text-xs font-bold text-[#4ECDC4] hover:bg-[#4ECDC4]/20 transition-all">
                            Edit ELO
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.07]">
              <span className="text-xs text-white/40">{data.total} players total</span>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft size={16} /></button>
                <span className="text-xs text-white/60 px-2">Page {page} of {data.totalPages}</span>
                <button disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ELO Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="bg-[#0c0818] border border-white/[0.12] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Edit ELO — {modal.stat.users?.username}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"><X size={16} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#4ECDC4] uppercase tracking-wider">Code ELO Rating</label>
                <input type="number" value={modal.elo} onChange={(e) => setModal(m => m ? { ...m, elo: Number(e.target.value) } : null)} min={0} className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#4ECDC4] transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#F5A623] uppercase tracking-wider">MCQ ELO Rating</label>
                <input type="number" value={modal.mcqElo} onChange={(e) => setModal(m => m ? { ...m, mcqElo: Number(e.target.value) } : null)} min={0} className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#F5A623] transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Reason (optional)</label>
                <input value={modal.reason} onChange={(e) => setModal(m => m ? { ...m, reason: e.target.value } : null)} placeholder="e.g. Correcting rating after system error" className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.3] transition-all" />
              </div>

              {modalError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{modalError}</div>}
              {modalSuccess && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400">{modalSuccess}</div>}

              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/70 hover:text-white transition-all">Cancel</button>
                <button onClick={handleEloUpdate} disabled={modalLoading} className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#4ECDC4] to-[#1A7A74] hover:brightness-110 transition-all disabled:opacity-50">
                  {modalLoading ? 'Saving…' : 'Update ELO'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
