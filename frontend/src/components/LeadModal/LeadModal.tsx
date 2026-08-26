import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, X, Award } from 'lucide-react';

import type { LeadData } from '../../types/referral';
import employeeDirectory from './employeeDirectory.json';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadData) => Promise<void>;
  loggedInEmail: string;
}

const PROJECTS = [
  'Embassy Edge Apartments',
  'Embassy One',
  'Embassy Lake Terraces',
  'Embassy Boulevard',
  'Embassy Grove',
  'Embassy Springs',
  'Embassy Springs - Town Centre Plots',
  'Embassy Springs - Estate Plots',
  'Embassy East Avenue',
  'By The Lake Plots',
  'Embassy Verde',
  'Embassy One Thane',
  'Embassy Paradiso',
  'Golf City Savroli',
  'Embassy Park Panvel',
  'Embassy Greenshore',
  'Embassy Citadel',
  'Embassy Verde 2',
  'Embassy Juhu',
  'Embassy Serenity',
  'Embassy Eden',
  'Embassy Origins',
  'Embassy Terazza'
];

const SALUTATIONS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];


const parseMagicPaste = (text: string) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  
  let name = '';
  let email = '';
  let countryCode = '+91';
  let mobile = '';
  let salutation = 'Mr.';

  // Check if there is a 10-digit number mashed inside the text
  const phoneMatch = text.match(/\d{10}/);
  if (phoneMatch) {
    mobile = phoneMatch[0];
    const parts = text.split(mobile);
    const leftPart = parts[0] || '';
    const rightPart = parts[1] || '';

    // Extract email from the right part first, or fall back to left part or whole text
    const emailMatch = rightPart.match(emailRegex) || leftPart.match(emailRegex) || text.match(emailRegex);
    email = emailMatch ? emailMatch[0] : '';

    // Clean up name from the left part
    const cleanedLeft = leftPart.replace(/[^a-zA-Z\s]/g, '').trim();
    name = cleanedLeft.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    // Determine salutation if name matches Ms, Dr etc
    const remainingText = leftPart + ' ' + rightPart;
    if (/\b(ms|miss|mrs)\b/i.test(remainingText)) {
      salutation = 'Ms.';
    } else if (/\b(dr|doctor)\b/i.test(remainingText)) {
      salutation = 'Dr.';
    }
  } else {
    // Fallback to standard parsing if no 10-digit number is found
    const emailMatch = text.match(emailRegex);
    email = emailMatch ? emailMatch[0] : '';
    const remainingText = email ? text.replace(email, '') : text;
    const phoneRegex = /(\+?\d{1,3})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})|(\+91)?\s?(\d{10})/;
    const altPhoneMatch = remainingText.match(phoneRegex);
    if (altPhoneMatch) {
      const rawPhone = altPhoneMatch[0].trim();
      const cleanPhone = rawPhone.replace(/[^\d+]/g, '');
      if (cleanPhone.startsWith('+')) {
        if (cleanPhone.startsWith('+91')) {
          countryCode = '+91';
          mobile = cleanPhone.substring(3);
        } else {
          countryCode = cleanPhone.substring(0, 3);
          mobile = cleanPhone.substring(3);
        }
      } else if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) {
        countryCode = '+91';
        mobile = cleanPhone.substring(2);
      } else {
        mobile = cleanPhone;
      }
    }

    const lines = remainingText.split('\n');
    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine) continue;
      if (emailRegex.test(cleanLine)) continue;
      if (phoneRegex.test(cleanLine)) continue;
      if (/^(email|phone|mobile|tel|ph|name|to|dear|hi|hello|subject|from|sent|date):/i.test(cleanLine)) continue;
      const cleanedName = cleanLine.replace(/[^a-zA-Z\s]/g, '').trim();
      name = cleanedName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      if (name) break;
    }

    if (/\b(ms|miss|mrs)\b/i.test(remainingText)) {
      salutation = 'Ms.';
    } else if (/\b(dr|doctor)\b/i.test(remainingText)) {
      salutation = 'Dr.';
    }
  }

  return { name, email, countryCode, mobile, salutation };
};

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loggedInEmail
}) => {
  const [formData, setFormData] = useState<LeadData>(() => {
    return {
      empId: employeeDirectory.empId,
      empName: employeeDirectory.empName,
      empMobile: employeeDirectory.empMobile,
      empEmail: employeeDirectory.empEmail,
      salutation: 'Mr.',
      name: '',
      countryCode: '+91',
      mobile: '',
      email: '',
      projectInterested: PROJECTS[0],
      SubSource: employeeDirectory.SubSource
    };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactPickerSupported, setIsContactPickerSupported] = useState(false);
  const [magicPasteText, setMagicPasteText] = useState('');
  const [magicPasteSuccess, setMagicPasteSuccess] = useState(false);

  useEffect(() => {
    // Check support for contact picker
    const supported = 'contacts' in navigator && 'ContactsManager' in window;
    setIsContactPickerSupported(supported);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        empId: employeeDirectory.empId,
        empName: employeeDirectory.empName,
        empMobile: employeeDirectory.empMobile,
        empEmail: employeeDirectory.empEmail,
        salutation: 'Mr.',
        name: '',
        countryCode: '+91',
        mobile: '',
        email: '',
        projectInterested: PROJECTS[0],
        SubSource: employeeDirectory.SubSource
      });
      setErrors({});
      setIsSubmitting(false);
      setMagicPasteText('');
      setMagicPasteSuccess(false);
    }
  }, [isOpen, loggedInEmail]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadData, string>> = {};

    // Validate Employee fields
    if (!formData.empId.trim()) newErrors.empId = 'Employee ID is required';
    if (!formData.empName.trim()) newErrors.empName = 'Employee Name is required';
    if (!formData.empMobile.trim()) newErrors.empMobile = 'Employee Mobile is required';
    if (!formData.empEmail.trim()) newErrors.empEmail = 'Employee Email is required';

    // Validate Lead fields
    if (!formData.name.trim()) {
      newErrors.name = 'Lead Name is required';
    }

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Lead Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[0-9\s\-]{8,15}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Lead Mobile is required';
    } else if (!phoneRegex.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    if (!formData.projectInterested) {
      newErrors.projectInterested = 'Project selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: keyof LeadData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleMagicPasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMagicPasteText(val);
    if (!val.trim()) {
      setMagicPasteSuccess(false);
      return;
    }

    const parsed = parseMagicPaste(val);
    if (parsed.name || parsed.mobile || parsed.email) {
      setFormData((prev) => ({
        ...prev,
        name: parsed.name,
        email: parsed.email,
        countryCode: parsed.countryCode || '+91',
        mobile: parsed.mobile,
        salutation: parsed.salutation || 'Mr.'
      }));
      setMagicPasteSuccess(true);
      
      setErrors((prev) => {
        const next = { ...prev };
        if (parsed.name) delete next.name;
        if (parsed.email) delete next.email;
        if (parsed.mobile) delete next.mobile;
        return next;
      });
    }
  };

  const handleImportContacts = async () => {
    try {
      const props = ['name', 'email', 'tel'];
      const opts = { multiple: false };
      // @ts-ignore
      const contacts = await navigator.contacts.select(props, opts);
      
      if (contacts && contacts.length > 0) {
        const contact = contacts[0];
        const name = contact.name && contact.name[0] ? contact.name[0] : '';
        const email = contact.email && contact.email[0] ? contact.email[0] : '';
        
        let mobile = '';
        let countryCode = '+91';
        if (contact.tel && contact.tel[0]) {
          const rawPhone = contact.tel[0].trim();
          const cleanPhone = rawPhone.replace(/[^\d+]/g, '');
          if (cleanPhone.startsWith('+')) {
            if (cleanPhone.startsWith('+91')) {
              countryCode = '+91';
              mobile = cleanPhone.substring(3);
            } else {
              countryCode = cleanPhone.substring(0, 3);
              mobile = cleanPhone.substring(3);
            }
          } else if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) {
            countryCode = '+91';
            mobile = cleanPhone.substring(2);
          } else {
            mobile = cleanPhone;
          }
        }

        setFormData((prev) => ({
          ...prev,
          name: name || prev.name,
          email: email || prev.email,
          countryCode: countryCode || prev.countryCode,
          mobile: mobile || prev.mobile
        }));

        setErrors((prev) => {
          const next = { ...prev };
          if (name) delete next.name;
          if (email) delete next.email;
          if (mobile) delete next.mobile;
          return next;
        });
      }
    } catch (err) {
      console.error('Contact Picker error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-borders dark:border-zinc-800 overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-borders dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
          <h3 className="text-base font-bold text-mainText dark:text-zinc-100 flex items-center gap-2">
            <Award size={18} className="text-[#0066CC]" />
            Create New Referral Lead
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-metadata hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-mainText dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Smart Input Helpers */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-lg border border-borders dark:border-zinc-850 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-mainText dark:text-zinc-350">
                Quick Fill Helpers
              </span>
              {isContactPickerSupported && (
                <button
                  type="button"
                  onClick={handleImportContacts}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0066CC] hover:bg-[#0052a3] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <User size={13} />
                  Import from Phone Contacts
                </button>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-descText dark:text-zinc-400 uppercase tracking-wider">
                Magic Paste (Name, Phone, Email)
              </label>
              <textarea
                rows={2}
                placeholder="Paste email signature, message, or contact card here to auto-fill details..."
                value={magicPasteText}
                onChange={handleMagicPasteChange}
                className="w-full px-3 py-2 rounded-lg border border-borders dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20 resize-none placeholder:text-metadata"
              />
              {magicPasteSuccess && (
                <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  ✓ Successfully extracted details!
                </p>
              )}
            </div>
          </div>

          {/* Referral Details */}
          <div className="space-y-4 pt-1">
            <h4 className="text-xs font-bold text-[#0066CC] dark:text-[#3399FF] uppercase tracking-wider border-b border-borders dark:border-zinc-800 pb-1.5">
              Referral Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-descText dark:text-zinc-400 uppercase tracking-wider">
                  Salutation
                </label>
                <select
                  value={formData.salutation}
                  onChange={(e) => handleInputChange('salutation', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-borders dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20"
                >
                  {SALUTATIONS.map((sal) => (
                    <option key={sal} value={sal}>{sal}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-descText dark:text-zinc-400 uppercase tracking-wider">
                  Referral Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-metadata">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Arjun Mehta"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-red-300 bg-red-50 focus:ring-red-200 dark:bg-red-950/10'
                        : 'border-borders dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-[#0066CC]/20 focus:border-[#0066CC]'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-descText dark:text-zinc-400 uppercase tracking-wider">
                  Country Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91"
                  value={formData.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-borders dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-descText dark:text-zinc-400 uppercase tracking-wider">
                  Referral Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-metadata">
                    <Phone size={15} />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. 9123456780"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                      errors.mobile
                        ? 'border-red-300 bg-red-50 focus:ring-red-200 dark:bg-red-950/10'
                        : 'border-borders dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-[#0066CC]/20 focus:border-[#0066CC]'
                    }`}
                  />
                </div>
                {errors.mobile && <p className="text-[11px] text-red-500 font-medium">{errors.mobile}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-descText dark:text-zinc-400 uppercase tracking-wider">
                  Referral Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-metadata">
                    <Mail size={15} />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. arjun@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-300 bg-red-50 focus:ring-red-200 dark:bg-red-950/10'
                        : 'border-borders dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-[#0066CC]/20 focus:border-[#0066CC]'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-descText dark:text-zinc-400 uppercase tracking-wider">
                  Project Interested
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-metadata">
                    <Building2 size={15} />
                  </span>
                  <select
                    value={formData.projectInterested}
                    onChange={(e) => handleInputChange('projectInterested', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-950 border border-borders dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20 cursor-pointer text-zinc-900 dark:text-zinc-100"
                  >
                    {PROJECTS.map((proj) => (
                      <option key={proj} value={proj}>{proj}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-borders dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs md:text-sm font-medium border border-borders dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs md:text-sm font-medium text-white dark:text-zinc-900 bg-[#0066CC] dark:bg-zinc-100 hover:bg-[#0052a3] dark:hover:bg-zinc-200 rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Submit Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
