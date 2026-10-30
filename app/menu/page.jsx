'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Compass,
  MapPin,
  Calendar,
  Star,
  Ticket,
  Info,
  Phone,
  FileText,
  LogOut,
  LogIn,
  ChevronRight,
  X,
  ArrowLeft,
  Shield,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export default function MenuPage() {
  const router = useRouter();
  const { currentUser, isAdmin, logout } = useApp();
  const [activeInfoModal, setActiveInfoModal] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    router.push('/');
  };

  const menuSections = [
    {
      title: 'Events & Discovery',
      description: 'Find concerts, festival schedules, and view tickets',
      items: [
        {
          label: 'Explore Events Near Me',
          desc: 'Live music concerts, food carnivals & cultural shows',
          href: '/events',
          icon: <Compass size={18} className="text-blue-600" />
        },
        {
          label: 'Calendar & Schedules',
          desc: 'Filter events by upcoming dates and venues',
          href: '/events',
          icon: <Calendar size={18} className="text-purple-600" />
        },
        {
          label: 'Past Events & Reviews',
          desc: 'Concluded festivals and attendee feedback ratings',
          href: '/events?type=past',
          icon: <Star size={18} className="text-amber-600" />
        },
        {
          label: 'My Booked Passes',
          desc: 'Look up confirmed tickets and printable vouchers',
          href: '/bookings',
          icon: <Ticket size={18} className="text-emerald-600" />
        }
      ]
    },
    {
      title: 'Support & Policies',
      description: 'Ticketing guidelines, entry policies, and direct help',
      items: [
        {
          label: 'About Festivault',
          desc: 'Architecture and event discovery ecosystem',
          action: () => setActiveInfoModal('about'),
          icon: <Info size={18} className="text-blue-600" />
        },
        {
          label: 'Pay at Counter Policy',
          desc: 'Transparent zero-advance payment protocol',
          action: () => setActiveInfoModal('payment'),
          icon: <MapPin size={18} className="text-emerald-600" />
        },
        {
          label: 'Contact Support',
          desc: 'Assistance with tickets, dates, or venue inquiries',
          action: () => setActiveInfoModal('contact'),
          icon: <Phone size={18} className="text-slate-700" />
        },
        {
          label: 'Help & FAQ',
          desc: 'Frequently asked questions regarding festival entry',
          action: () => setActiveInfoModal('faq'),
          icon: <HelpCircle size={18} className="text-indigo-600" />
        }
      ]
    },
    {
      title: 'Account & Management',
      description: 'Manage session, review policies, or access organizer tools',
      items: [
        {
          label: 'Terms & Conditions',
          desc: 'Ticketing guidelines, code of conduct, and entry rules',
          action: () => setActiveInfoModal('terms'),
          icon: <FileText size={18} className="text-slate-600" />
        },
        {
          label: 'Organizer Console',
          desc: 'Authorized portal to create and monitor festivals',
          href: '/admin',
          icon: <Shield size={18} className="text-blue-600" />,
          badge: 'Portal'
        },
        currentUser || isAdmin
          ? {
              label: `Sign Out (${isAdmin ? 'Admin' : currentUser?.full_name?.split(' ')[0]})`,
              desc: 'Securely end your active session',
              action: () => setShowLogoutConfirm(true),
              icon: <LogOut size={18} className="text-red-600" />
            }
          : {
              label: 'Sign In to Account',
              desc: 'Access your passes or authenticate as organizer',
              href: '/login',
              icon: <LogIn size={18} className="text-slate-900" />
            }
      ]
    }
  ];

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Directory
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Festivault Platform Services
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Navigation &amp; Services
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Quick access directory to browse live events, track reservations, inspect venue policies, and manage accounts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-center"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {menuSections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
            >
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
                <h2 className="text-sm font-bold text-slate-900">
                  {section.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {section.description}
                </p>
              </div>

              <div className="divide-y divide-slate-100 flex-1">
                {section.items.map((item, itemIdx) => {
                  const content = (
                    <div className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50/80 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-slate-300 group-hover:bg-white transition-colors">
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-slate-400 shrink-0 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  );

                  return item.href ? (
                    <Link key={itemIdx} href={item.href} className="block no-underline">
                      {content}
                    </Link>
                  ) : (
                    <div key={itemIdx} onClick={item.action}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Modals */}
      {activeInfoModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveInfoModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveInfoModal(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors border border-slate-200"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {activeInfoModal === 'about' && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-3">
                  <Info size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  About Festivault System
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Festivault is an end-to-end Event and Festival Management Database System designed for rapid discovery, instant ticket reservation, and real-time organizer oversight.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 space-y-1.5 mb-4">
                  <div>&bull; <strong>Storage Architecture:</strong> PostgreSQL with real-time memory synchronization fallback.</div>
                  <div>&bull; <strong>Showcase CDN:</strong> ImageKit compressed media pipeline optimizing showcase posters to 1200&times;675.</div>
                  <div>&bull; <strong>Payment Architecture:</strong> Transparent pay-at-counter model ensuring zero upfront barrier to entry.</div>
                </div>
              </div>
            )}

            {activeInfoModal === 'payment' && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <MapPin size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Pay at Event Counter Policy
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  All reservations placed through Festivault do not require credit card or prepayment. Your digital pass guarantees entry wristbands reserved under your name.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 space-y-1.5 mb-4">
                  <div>1. Reserve passes online by selecting adult/child ticket count.</div>
                  <div>2. Present your Digital Pass QR/ID at the venue registration desk.</div>
                  <div>3. Complete ticket fee settlement via Cash or UPI and collect wristband.</div>
                </div>
              </div>
            )}

            {activeInfoModal === 'contact' && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-3">
                  <Phone size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Contact Support
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Our festival support operations team is available Monday through Saturday (09:00 AM &ndash; 08:00 PM IST).
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 space-y-2 mb-4">
                  <div><strong>Email Inquiries:</strong> support@festivault.local</div>
                  <div><strong>Helpline Desk:</strong> +91 (800) 456-7890</div>
                  <div><strong>Venue Coordination:</strong> concierge@festivault.local</div>
                </div>
              </div>
            )}

            {activeInfoModal === 'terms' && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-3">
                  <FileText size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Terms &amp; Conditions
                </h3>
                <div className="text-xs text-slate-600 leading-relaxed space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
                  <p>1. <strong>Entry Admission:</strong> Entry is granted solely to attendees possessing a confirmed digital pass with matching government-issued ID.</p>
                  <p>2. <strong>Age Regulations:</strong> Attendees must adhere to the designated age requirement stated on each individual festival listing.</p>
                  <p>3. <strong>Cancellation Policy:</strong> Unpaid reservations will be released to waitlisted attendees if uncollected 30 minutes after event start time.</p>
                  <p>4. <strong>Security Check:</strong> All bags and belongings are subject to security screening at the entry checkpoint.</p>
                </div>
              </div>
            )}

            {activeInfoModal === 'faq' && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
                  <HelpCircle size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Frequently Asked Questions
                </h3>
                <div className="text-xs text-slate-600 leading-relaxed space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
                  <p><strong>Q: Do I need to print my ticket?</strong><br />A: You can present either a printed ticket or the digital voucher on your smartphone screen at the counter.</p>
                  <p><strong>Q: Are children passes discounted?</strong><br />A: Yes, children aged 3 to 12 receive an automated 50% discount on all general admissions.</p>
                  <p><strong>Q: How do I cancel a reservation?</strong><br />A: Visit &quot;My Bookings&quot; with your registered email and click &quot;Cancel Pass&quot; anytime before showtime.</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveInfoModal(null)}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle size={20} />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Confirm Sign Out
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to sign out of your account? Any unsaved progress will be cleared.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 px-3.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2 px-3.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
