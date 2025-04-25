'use client';

import { useAuth } from '@/contexts/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

export default function AppHeader() {
  const { logout } = useAuth();

  return (
    <div className="fixed top-0 right-0 p-4 z-50">
      <button
        onClick={logout}
        className="bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors"
        aria-label="Logout"
        title="Logout"
      >
        <FaSignOutAlt />
      </button>
    </div>
  );
}
