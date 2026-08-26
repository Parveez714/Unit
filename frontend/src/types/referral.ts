export interface Referral {
  id: string;
  referralName: string;
  project: string;
  leadStatus: string;         // Open, Contacted, Qualified, Unqualified, Converted, DND
  opportunityStatus: string;  // Site Visit / Walk in, Blocked, Pre-Sales, Booking, Closed Lost, Booking Cancellation, Closed Won
  createdDate?: string;
}

export interface LeadData {
  empId: string;
  empName: string;
  empMobile: string;
  empEmail: string;
  salutation: string;
  name: string;
  countryCode: string;
  mobile: string;
  email: string;
  projectInterested: string;
  SubSource: string;
}
