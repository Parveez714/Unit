import React from 'react';
import { User, LogOut, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  email: string | null;
  onChangeEmail: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  email,
  onChangeEmail,
  isDarkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="bg-[#0C0C0C] text-white py-4 px-6 md:px-12 flex items-center justify-between border-b border-zinc-800 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0066CC] flex items-center justify-center font-bold text-lg tracking-wider">
          R
        </div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-white m-0">
          Referral Tracking Portal
        </h1>
      </div>

      <div className="flex items-center gap-4 text-sm">
        {/* Dark/Light mode button */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
        </button>

        {email && (
          <>
            <div className="hidden sm:flex items-center gap-2 text-[#9CA3AF]">
              <User size={16} />
              <span className="font-medium text-zinc-300">{email}</span>
            </div>
            <button
              onClick={onChangeEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs md:text-sm text-[#0066CC] font-semibold hover:text-[#3385ff] transition-all cursor-pointer"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
};
