import Navbar from '@/components/navbar/Navbar';
import Leaderboard from '@/components/battle/Leaderboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard | Cosmodex',
  description: 'View the top ranked arena players',
};

export default function LeaderboardPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#050508', color: '#fff', paddingTop: '80px', paddingBottom: '40px' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Battle Arena Leaderboard</h1>
        <Leaderboard />
      </div>
    </main>
  );
}
