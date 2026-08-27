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
    <header className="bg-sheen bg-header text-white py-4 px-6 md:px-12 flex items-center justify-between border-b border-white/10 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white text-ink-950 flex items-center justify-center font-display font-black text-lg tracking-wider ring-1 ring-white/20 shadow-[0_0_0_4px_rgba(255,255,255,0.06)]">
          R
        </div>
        <h1 className="text-lg md:text-xl font-display font-extrabold tracking-tight text-white m-0">
          Referral Tracking Portal
        </h1>
      </div>

      <div className="flex items-center gap-4 text-sm">
        {/* Dark/Light mode button */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-ink-200 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {email && (
          <>
            <div className="hidden sm:flex items-center gap-2 text-ink-300">
              <User size={16} />
              <span className="font-medium text-ink-200">{email}</span>
            </div>
            <button
              onClick={onChangeEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-ink-950 hover:bg-ink-100 border border-white text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-sm"
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
