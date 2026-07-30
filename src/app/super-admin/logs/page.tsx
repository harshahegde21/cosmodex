'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ScrollText, Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface LogEntry {
  id: string;
  actor_id: string | null;
  actor_role: string | null;
  section: string | null;
  action: string | null;
  target_table: string | null;
  target_id: string | null;
  old_value_json: unknown;
  new_value_json: unknown;
  ip_address: string | null;
  created_at: string | null;
  users: { username: string; email: string } | null;
}

interface LogsResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  totalPages: number;
}

const SECTION_COLORS: Record<string, string> = {
  user_management: '#E873C3',
  admin_management: '#4ECDC4',
  battle_arena: '#FF6B35',
  account: '#F5A623',
};

export default function SuperAdminLogsPage() {
  const [data, setData] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('action', search);
      const res = await fetch(`/api/admin/super/logs?${params}`);
      if (res.ok) setData(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set('action', search);

    fetch(`/api/admin/super/logs?${params}`)
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

  const formatDate = (s: string | null) =>
    s ? new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ScrollText size={20} className="text-[#F5A623]" />
              <h1 className="text-2xl font-black text-white">Audit Logs</h1>
            </div>
            <p className="text-sm text-white/40">All administrative actions recorded with actor, target, and change details.</p>
          </div>
          <button onClick={fetchLogs} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/70 hover:text-white transition-all">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Filter by action…"
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#F5A623] transition-all"
          />
        </div>

        {/* Log entries */}
        <div className="flex flex-col gap-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/[0.03] border border-white/[0.06] rounded-xl animate-pulse" />
            ))
          ) : data?.logs.length === 0 ? (
            <div className="py-16 text-center text-white/30 text-sm bg-white/[0.02] border border-white/[0.06] rounded-2xl">
              No audit logs found.
            </div>
          ) : (
            data?.logs.map((log) => {
              const color = SECTION_COLORS[log.section ?? ''] ?? '#A9A8BE';
              const isExpanded = expandedId === log.id;

              return (
                <div key={log.id} className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/[0.12] transition-all">
                  <button
                    className="w-full text-left px-5 py-4 flex items-center gap-4"
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  >
                    {/* Section badge */}
                    <span
                      className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                      style={{ background: `${color}18`, color }}
                    >
                      {log.section ?? 'system'}
                    </span>

                    {/* Action */}
                    <span className="flex-1 text-sm font-semibold text-white min-w-0 truncate">
                      {log.action ?? 'unknown_action'}
                    </span>

                    {/* Actor */}
                    <span className="text-xs text-white/40 flex-shrink-0 hidden sm:block">
                      by {log.users?.username ?? log.actor_id?.slice(0, 8) ?? 'system'}
                    </span>

                    {/* Time */}
                    <span className="text-xs text-white/30 flex-shrink-0">{formatDate(log.created_at)}</span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-4 border-t border-white/[0.06] pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-white/30 mb-1 font-bold uppercase tracking-wider">Details</p>
                        <div className="flex flex-col gap-1 text-white/60">
                          <span><span className="text-white/30">Actor:</span> {log.users?.username} ({log.actor_role})</span>
                          <span><span className="text-white/30">Target:</span> {log.target_table} / {log.target_id?.slice(0, 8) ?? '—'}…</span>
                          <span><span className="text-white/30">IP:</span> {log.ip_address ?? '—'}</span>
                        </div>
                      </div>
                      {(log.old_value_json != null || log.new_value_json != null) && (
                        <div>
                          <p className="text-white/30 mb-1 font-bold uppercase tracking-wider">Changes</p>
                          {log.old_value_json !== null && (
                            <div className="mb-2">
                              <span className="text-red-400 font-bold">Before: </span>
                              <code className="text-white/50 break-all">{JSON.stringify(log.old_value_json as object)}</code>
                            </div>
                          )}
                          {log.new_value_json !== null && (
                            <div>
                              <span className="text-green-400 font-bold">After: </span>
                              <code className="text-white/50 break-all">{JSON.stringify(log.new_value_json as object)}</code>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">{data.total} total entries</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-white/60 px-2">Page {page} of {data.totalPages}</span>
              <button disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
