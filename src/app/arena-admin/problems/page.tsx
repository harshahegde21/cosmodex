'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Swords, Plus, Search, ChevronLeft, ChevronRight, RefreshCw, X, Trash2, Pencil } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  base_points: number;
  time_limit_sec: number;
  memory_limit_mb: number;
  created_at: string;
  publicTestCases: number;
  hiddenTestCases: number;
  totalTestCases: number;
}

interface ProblemsResponse {
  problems: Problem[];
  total: number;
  page: number;
  totalPages: number;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#3DCB7F',
  medium: '#F5A623',
  hard: '#E85D5D',
};

const EMPTY_FORM = { title: '', description: '', difficulty: 'easy', base_points: 100, time_limit_sec: 2, memory_limit_mb: 128 };
const EMPTY_TC = { input: '', expected: '', is_public: true };

export default function ArenaProblemsPage() {
  const [data, setData] = useState<ProblemsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<Problem | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [testCases, setTestCases] = useState([{ ...EMPTY_TC }]);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('search', search);
      if (difficulty) params.set('difficulty', difficulty);
      const res = await fetch(`/api/admin/arena/problems?${params}`);
      if (res.ok) setData(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [page, search, difficulty]);

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set('search', search);
    if (difficulty) params.set('difficulty', difficulty);

    fetch(`/api/admin/arena/problems?${params}`)
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
  }, [page, search, difficulty]);

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setTestCases([{ ...EMPTY_TC }]); setFormError(''); setModal('create'); setEditTarget(null); };
  const openEdit = (p: Problem) => { setForm({ title: p.title, description: p.description, difficulty: p.difficulty, base_points: p.base_points, time_limit_sec: p.time_limit_sec, memory_limit_mb: p.memory_limit_mb }); setTestCases([{ ...EMPTY_TC }]); setFormError(''); setModal('edit'); setEditTarget(p); };
  const closeModal = () => { setModal(null); setEditTarget(null); };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: ['base_points', 'time_limit_sec', 'memory_limit_mb'].includes(name) ? Number(value) : value }));
  };

  const handleTcChange = (i: number, field: string, value: string | boolean) => {
    setTestCases((prev) => prev.map((tc, idx) => idx === i ? { ...tc, [field]: value } : tc));
  };

  const addTc = () => setTestCases((p) => [...p, { ...EMPTY_TC }]);
  const removeTc = (i: number) => setTestCases((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const url = modal === 'create' ? '/api/admin/arena/problems' : `/api/admin/arena/problems/${editTarget!.id}`;
      const method = modal === 'create' ? 'POST' : 'PATCH';
      const body = modal === 'create' ? { ...form, test_cases: testCases } : form;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) { setFormError(json.error ?? 'Failed'); }
      else { closeModal(); fetchProblems(); }
    } catch { setFormError('Network error.'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/arena/problems/${id}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchProblems();
    } catch { /* ignore */ }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1"><Swords size={20} className="text-[#FF6B35]" /><h1 className="text-2xl font-black text-white">Battle Problems</h1></div>
            <p className="text-sm text-white/40">Manage competitive coding problems used in 1v1 battle arena matches.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchProblems} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/70 hover:text-white transition-all"><RefreshCw size={14} /></button>
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#C0392B] hover:brightness-110 transition-all"><Plus size={16} />New Problem</button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search problems…" className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B35] transition-all" />
          </div>
          <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF6B35] transition-all">
            <option value="" className="bg-[#0c0818]">All Difficulties</option>
            <option value="easy" className="bg-[#0c0818]">Easy</option>
            <option value="medium" className="bg-[#0c0818]">Medium</option>
            <option value="hard" className="bg-[#0c0818]">Hard</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {['Title', 'Difficulty', 'Points', 'Test Cases', 'Limits', 'Created', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold text-white/30 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <tr key={i} className="border-b border-white/[0.04]">{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-white/[0.05] rounded animate-pulse" /></td>)}</tr>)
                ) : data?.problems.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-white/30 text-sm">No problems found. Create one above!</td></tr>
                ) : (
                  data?.problems.map((prob) => {
                    const dc = DIFFICULTY_COLORS[prob.difficulty] ?? '#A9A8BE';
                    return (
                      <tr key={prob.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-white">{prob.title}</p>
                          <p className="text-xs text-white/40 truncate max-w-[200px]">{prob.description.slice(0, 60)}…</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize" style={{ background: `${dc}18`, color: dc }}>{prob.difficulty}</span>
                        </td>
                        <td className="px-5 py-4 text-white/60 font-mono">{prob.base_points}</td>
                        <td className="px-5 py-4 text-white/60">
                          <span className="text-green-400">{prob.publicTestCases} pub</span> · <span className="text-white/40">{prob.hiddenTestCases} hid</span>
                        </td>
                        <td className="px-5 py-4 text-white/40 text-xs whitespace-nowrap">{prob.time_limit_sec}s / {prob.memory_limit_mb}MB</td>
                        <td className="px-5 py-4 text-white/40 text-xs whitespace-nowrap">{new Date(prob.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(prob)} className="p-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"><Pencil size={14} /></button>
                            <button onClick={() => setDeleteId(prob.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400/60 hover:text-red-400 hover:bg-red-500/20 transition-all"><Trash2 size={14} /></button>
                          </div>
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
              <span className="text-xs text-white/40">{data.total} problems total</span>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft size={16} /></button>
                <span className="text-xs text-white/60 px-2">Page {page} of {data.totalPages}</span>
                <button disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Create/Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 overflow-y-auto py-8">
          <div className="bg-[#0c0818] border border-white/[0.12] rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white">{modal === 'create' ? 'Create Battle Problem' : 'Edit Problem'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Title</label>
                  <input name="title" value={form.title} onChange={handleFormChange} required placeholder="Problem title" className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B35] transition-all" />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} required rows={4} placeholder="Problem statement (supports markdown)" className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B35] transition-all resize-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Difficulty</label>
                  <select name="difficulty" value={form.difficulty} onChange={handleFormChange} className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B35] transition-all">
                    <option value="easy" className="bg-[#0c0818]">Easy</option>
                    <option value="medium" className="bg-[#0c0818]">Medium</option>
                    <option value="hard" className="bg-[#0c0818]">Hard</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Base Points</label>
                  <input name="base_points" type="number" value={form.base_points} onChange={handleFormChange} min={1} required className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B35] transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Time Limit (seconds)</label>
                  <input name="time_limit_sec" type="number" value={form.time_limit_sec} onChange={handleFormChange} min={1} max={30} required className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B35] transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Memory Limit (MB)</label>
                  <input name="memory_limit_mb" type="number" value={form.memory_limit_mb} onChange={handleFormChange} min={32} max={512} required className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B35] transition-all" />
                </div>
              </div>

              {/* Test Cases (only for create) */}
              {modal === 'create' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Test Cases</label>
                    <button type="button" onClick={addTc} className="text-xs font-bold text-[#FF6B35] hover:text-[#FF6B35]/80 transition-colors">+ Add Test Case</button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {testCases.map((tc, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white/40">Test #{i + 1}</span>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-xs text-white/50 cursor-pointer">
                              <input type="checkbox" checked={tc.is_public} onChange={(e) => handleTcChange(i, 'is_public', e.target.checked)} className="accent-[#FF6B35]" />
                              Public
                            </label>
                            {testCases.length > 1 && <button type="button" onClick={() => removeTc(i)} className="text-red-400/60 hover:text-red-400 transition-colors"><X size={14} /></button>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <textarea value={tc.input} onChange={(e) => handleTcChange(i, 'input', e.target.value)} placeholder="Input" rows={2} className="bg-white/[0.05] border border-white/[0.07] rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-white/25 focus:outline-none focus:border-[#FF6B35] resize-none" />
                          <textarea value={tc.expected} onChange={(e) => handleTcChange(i, 'expected', e.target.value)} placeholder="Expected Output" rows={2} className="bg-white/[0.05] border border-white/[0.07] rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-white/25 focus:outline-none focus:border-[#FF6B35] resize-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{formError}</div>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/70 hover:text-white transition-all">Cancel</button>
                <button type="submit" disabled={formLoading} className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF6B35] to-[#C0392B] hover:brightness-110 transition-all disabled:opacity-50">
                  {formLoading ? 'Saving…' : modal === 'create' ? 'Create Problem' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirmation ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="bg-[#0c0818] border border-white/[0.12] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-white mb-2">Delete Problem</h3>
            <p className="text-sm text-white/50 mb-5">This will permanently delete the problem and all its test cases and submissions. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/70 hover:text-white transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
