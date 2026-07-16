'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/onboarding?mode=login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      Log out
    </button>
  );
}
