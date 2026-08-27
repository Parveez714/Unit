import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header/Header';
import { BackgroundPattern } from './components/BackgroundPattern/BackgroundPattern';
import { EmailModal } from './components/EmailModal/EmailModal';
import { ReferralFilters } from './components/ReferralFilters/ReferralFilters';
import { ReferralTable } from './components/ReferralTable/ReferralTable';
import { LoadingState } from './components/LoadingState/LoadingState';
import { EmptyState } from './components/EmptyState/EmptyState';
import { ErrorState } from './components/ErrorState/ErrorState';
import { LeadModal } from './components/LeadModal/LeadModal';
import type { Referral, LeadData } from './types/referral';
import { referralService } from './services/referralService';
import { ArrowRight, Sparkles, LayoutList, Plus } from 'lucide-react';
import employeeDirectory from './components/LeadModal/employeeDirectory.json';

function App() {
  const [email, setEmail] = useState<string | null>(employeeDirectory.empEmail);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('dark_mode');
    if (saved) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedLeadStatus, setSelectedLeadStatus] = useState('All Lead Statuses');
  const [selectedOpportunityStatus, setSelectedOpportunityStatus] = useState('All Opportunity Stages');

  // Handle class list side effects
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Load referrals and projects list
  const loadDashboardData = useCallback(async (currentEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Load projects and referrals in parallel
      const [fetchedReferrals, fetchedProjects] = await Promise.all([
        referralService.getReferrals(currentEmail),
        referralService.getProjects(currentEmail),
      ]);
      
      setReferrals(fetchedReferrals);
      setProjects(fetchedProjects);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle email entry & submission
  const handleEmailSubmit = (enteredEmail: string) => {
    localStorage.setItem('referral_email', enteredEmail);
    setEmail(enteredEmail);
    setIsModalOpen(false);
    // Reset filters when swapping email accounts
    setSearch('');
    setSelectedProject('All Projects');
    setSelectedLeadStatus('All Lead Statuses');
    setSelectedOpportunityStatus('All Opportunity Stages');
  };

  // Re-fetch when email or filter inputs change
  useEffect(() => {
    if (email) {
      loadDashboardData(email);
    }
  }, [email, loadDashboardData]);

  // Handle logout / sign out
  const handleSignOut = () => {
    localStorage.removeItem('referral_email');
    setEmail(null);
    setIsModalOpen(true);
  };

  const handleLeadSubmit = async (leadData: LeadData) => {
    try {
      const newLead = await referralService.createLead(leadData);
      // Close the modal upon successful lead submission
      setIsLeadModalOpen(false);
      // Prepend the new lead to local state immediately for instant feedback
      setReferrals(prev => [newLead, ...prev]);
      
      if (email) {
        loadDashboardData(email);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit lead.');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedProject('All Projects');
    setSelectedLeadStatus('All Lead Statuses');
    setSelectedOpportunityStatus('All Opportunity Stages');
  };

  const displayedReferrals = useMemo(() => {
    return referrals.filter((ref) => {
      if (search.trim() && !ref.referralName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selectedProject !== 'All Projects' && ref.project !== selectedProject) {
        return false;
      }
      if (selectedLeadStatus !== 'All Lead Statuses' && ref.leadStatus !== selectedLeadStatus) {
        return false;
      }
      if (selectedOpportunityStatus !== 'All Opportunity Stages' && ref.opportunityStatus !== selectedOpportunityStatus) {
        return false;
      }
      return true;
    });
  }, [referrals, search, selectedProject, selectedLeadStatus, selectedOpportunityStatus]);

  return (
    <div className="relative min-h-screen bg-background dark:bg-ink-950 flex flex-col font-sans transition-colors duration-200">
      <BackgroundPattern />
      <Header
        email={email}
        onChangeEmail={handleSignOut}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8">
        {!email ? (
          /* Landing Screen (No traditional login page) */
          <div className="relative flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto">
            <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-ink-700 to-ink-950 text-white dark:bg-white dark:text-ink-950 dark:bg-none text-xs font-semibold mb-6 shadow-sm border border-ink-900 dark:border-white">
              <Sparkles size={12} />
              Internal Referral Portal
            </div>

            <h2 className="relative text-4xl md:text-5xl font-display font-extrabold text-mainText dark:text-white tracking-tight leading-none mb-4">
              Referral Tracking Portal
            </h2>
            <p className="relative text-base md:text-lg text-descText dark:text-ink-400 max-w-lg mb-8 leading-relaxed">
              View and track real-time referrals associated with your corporate email address in one simple, centralized dashboard.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-ink-700 to-ink-950 hover:from-ink-600 hover:to-black text-white dark:bg-white dark:bg-none dark:text-ink-950 dark:hover:bg-ink-100 rounded-lg text-sm md:text-base font-semibold shadow-lg shadow-ink-950/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Enter Email ID
              <ArrowRight size={16} />
            </button>

            {/* Visual placeholder or layout block to anchor the page design */}
            <div className="relative w-full mt-12 p-1.5 bg-gradient-to-b from-shell to-shell-muted/60 dark:from-ink-900/60 dark:to-ink-900/20 rounded-2xl border border-borders dark:border-ink-800 shadow-inner">
              <div className="bg-white dark:bg-ink-900 rounded-xl border border-borders dark:border-ink-800 p-6 text-left flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-borders dark:border-ink-800 pb-4">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-ink-700 to-ink-950 dark:bg-white dark:bg-none flex items-center justify-center font-bold text-xs text-white dark:text-ink-900">
                    RP
                  </div>
                  <div className="h-4 bg-shell-muted dark:bg-ink-800 rounded w-40"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-shell-muted dark:bg-ink-800 rounded w-full"></div>
                  <div className="h-4 bg-shell-muted dark:bg-ink-800 rounded w-5/6"></div>
                  <div className="h-4 bg-shell-muted dark:bg-ink-800 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main Dashboard Area */
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-extrabold text-mainText dark:text-white tracking-tight">
                  Referral Dashboard
                </h2>
                {email && (
                  <p className="text-sm text-descText dark:text-ink-400 mt-1 font-semibold">
                    Welcome {employeeDirectory.empName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-ink-700 to-ink-950 hover:from-ink-600 hover:to-black dark:bg-white dark:bg-none dark:text-ink-950 dark:hover:bg-ink-100 text-white rounded-lg text-xs md:text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={14} />
                  Create Referral Lead
                </button>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-shell dark:bg-ink-900 text-mainText dark:text-ink-200 border border-borders dark:border-ink-800 text-xs font-semibold">
                  <LayoutList size={14} />
                  {referrals.length} {referrals.length === 1 ? 'Referral' : 'Referrals'}
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <ReferralFilters
              search={search}
              onSearchChange={setSearch}
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
              selectedLeadStatus={selectedLeadStatus}
              onLeadStatusChange={setSelectedLeadStatus}
              selectedOpportunityStatus={selectedOpportunityStatus}
              onOpportunityStatusChange={setSelectedOpportunityStatus}
              projectsList={projects}
              onClearFilters={handleClearFilters}
            />

            {/* Dashboard States */}
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} onRetry={() => loadDashboardData(email)} />
            ) : displayedReferrals.length === 0 ? (
              <EmptyState 
                isFilterActive={
                  search !== '' || 
                  selectedProject !== 'All Projects' || 
                  selectedLeadStatus !== 'All Lead Statuses' || 
                  selectedOpportunityStatus !== 'All Opportunity Stages'
                }
                onClearFilters={handleClearFilters}
              />
            ) : (
              <ReferralTable referrals={displayedReferrals} />
            )}
          </div>
        )}
      </main>

      {/* Email Entry Modal */}
      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContinue={handleEmailSubmit}
        initialEmail={email || ''}
      />

      {/* Lead Creation Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmit={handleLeadSubmit}
        loggedInEmail={email || ''}
      />
    </div>
  );
}

export default App;
