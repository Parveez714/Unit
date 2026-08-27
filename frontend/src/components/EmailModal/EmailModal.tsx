import React, { useState, useEffect } from 'react';
import { Mail, AlertCircle, X } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (email: string) => void;
  initialEmail?: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  initialEmail = ''
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setError('');
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const validateEmail = (val: string) => {
    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regex.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    onContinue(trimmedEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-md bg-white dark:bg-ink-900 rounded-xl shadow-2xl border border-borders dark:border-ink-800 overflow-hidden transform transition-all duration-300 scale-100">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-borders dark:border-ink-800 bg-shell dark:bg-ink-950/50">
          <h3 className="text-base font-display font-semibold text-mainText dark:text-zinc-100">Enter Email ID</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-metadata hover:bg-shell-muted dark:hover:bg-ink-800 hover:text-mainText dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email-input" className="block text-xs font-semibold text-descText dark:text-zinc-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-metadata">
                <Mail size={16} />
              </span>
              <input
                id="email-input"
                type="text"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? 'border-ink-950 dark:border-white bg-shell dark:bg-ink-950 focus:ring-ink-900/10 dark:focus:ring-white/10'
                    : 'border-borders dark:border-ink-800 bg-white dark:bg-ink-950 text-zinc-900 dark:text-zinc-100 focus:ring-ink-900/10 dark:focus:ring-white/10 focus:border-ink-500'
                }`}
                autoFocus
              />
            </div>
            {error && (
              <p className="flex items-center gap-1 text-xs text-mainText dark:text-zinc-200 mt-1 font-semibold">
                <AlertCircle size={12} />
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs md:text-sm font-medium border border-borders dark:border-ink-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-shell dark:hover:bg-ink-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs md:text-sm font-medium text-white dark:text-ink-950 bg-gradient-to-br from-ink-700 to-ink-950 dark:bg-white dark:bg-none hover:from-ink-600 hover:to-black dark:hover:bg-ink-100 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              Continue
            </button>
          </div>
        </form>

        {/* Tip section */}
        <div className="px-6 py-3 bg-shell dark:bg-ink-950/50 border-t border-borders dark:border-ink-800 text-[11px] text-metadata leading-relaxed">
          <span className="font-semibold text-descText dark:text-zinc-300">Test tips:</span> Enter <code className="bg-shell-muted dark:bg-ink-800 text-zinc-800 dark:text-zinc-200 px-1 rounded">user@example.com</code> for full data, <code className="bg-shell-muted dark:bg-ink-800 text-zinc-800 dark:text-zinc-200 px-1 rounded">empty@example.com</code> for empty, and <code className="bg-shell-muted dark:bg-ink-800 text-zinc-800 dark:text-zinc-200 px-1 rounded">error@example.com</code> for error.
        </div>
      </div>
    </div>
  );
};
