import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Battle Arena | Cosmodex',
  description: 'Real-time competitive coding & MCQ battles. Join the queue, match against opponents, and prove your skills.',
};

export default function BattleArenaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050508' }}>
      {children}
    </div>
  );
}
