import type { Referral, LeadData } from '../types/referral';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.DEV
    ? `http://${window.location.hostname}:8000/api`
    : `${window.location.origin}/api`
);

export const referralService = {
  /**
   * Fetches referrals for a specific email, applying optional filters.
   */
  async getReferrals(
    email: string,
    filters?: { search?: string; project?: string; leadStatus?: string; opportunityStatus?: string }
  ): Promise<Referral[]> {
    const params = new URLSearchParams({ email });
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.project && filters.project !== 'All Projects') {
      params.append('project', filters.project);
    }
    if (filters?.leadStatus && filters.leadStatus !== 'All Lead Statuses') {
      params.append('leadStatus', filters.leadStatus);
    }
    if (filters?.opportunityStatus && filters.opportunityStatus !== 'All Opportunity Stages') {
      params.append('opportunityStatus', filters.opportunityStatus);
    }

    const response = await fetch(`${API_BASE_URL}/referrals?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch referrals');
    }

    return response.json();
  },

  /**
   * Fetches unique project names for a given email to populate the filters.
   */
  async getProjects(email: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/projects?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },

  /**
   * Submits a new referral lead.
   */
  async createLead(leadData: LeadData): Promise<Referral> {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create lead');
    }

    return response.json();
  }
};
