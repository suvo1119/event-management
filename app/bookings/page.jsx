'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import DigitalTicket from '@/components/DigitalTicket';
import {
  Ticket,
  Search,
  Plus,
  Trash2,
  Calendar,
  Clock,
  User
} from 'lucide-react';

export default function BookingsPage() {
  const { bookings, currentUser, deleteBooking } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    if (currentUser?.email) {
      setEmailInput(currentUser.email);
    }
  }, [currentUser]);

  const userBookings = useMemo(() => {
    if (!emailInput.trim()) return bookings;
    const norm = emailInput.trim().toLowerCase();
    return bookings.filter((b) => b.user_email === norm);
  }, [bookings, emailInput]);

  const totalSpent = userBookings.reduce(
    (sum, b) => sum + (Number(b.total_price) || 0),
    0
  );

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-1.5">
              My Passes
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Booked Passes
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Review your reserved festival tickets, generate printable boarding vouchers, or cancel reservations.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Plus size={15} />
            <span>Book Another Event</span>
          </Link>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-wrap justify-between items-center gap-3.5">
          <div className="relative flex-1 min-w-[260px]">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Search by registered email address (e.g. name@example.com)..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
            />
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <div className="flex gap-4 items-center text-xs text-slate-500">
            <div>
              Showing: <strong className="text-slate-900 font-semibold">{userBookings.length}</strong> bookings
            </div>
            <div>
              Total Due at Counter:{' '}
              <strong className="text-emerald-600 text-sm font-extrabold">
                ₹{totalSpent.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {userBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {userBookings.map((b) => (
              <div
                key={b.booking_id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-slate-300"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-1">
                      {b.category_name || 'General'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{b.title}</h3>
                    <div className="text-slate-500 text-xs">
                      Reservation #{b.booking_id}
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Pay at Counter
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400 shrink-0" />
                    <span>{b.start_date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400 shrink-0" />
                    <span>{b.time_slot || '07:30 PM'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <User size={13} className="text-slate-400 shrink-0" />
                    <span>
                      {b.adults ?? 1} Adult(s), {b.children ?? 0} Child(ren)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">
                    Due at Counter:
                  </span>
                  <strong className="text-emerald-600 text-sm font-bold">
                    ₹{b.total_price}
                  </strong>
                </div>

                <div className="text-[11px] text-slate-500 truncate">
                  Registered to: <span className="text-slate-900 font-medium">{b.user_email}</span>
                </div>

                {/* Card Actions */}
                <div className="flex gap-2 mt-auto pt-2.5 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(b)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Ticket size={14} />
                    <span>View Pass / Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Cancel booking #${b.booking_id} for ${b.title}?`)) {
                        deleteBooking(b.booking_id);
                      }
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                    title="Cancel reservation"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              No bookings found
            </h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4 leading-relaxed">
              You don&apos;t have any active reservations under &quot;{emailInput || 'this filter'}&quot;. Discover upcoming festivals and reserve your tickets.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
            >
              Browse Upcoming Events
            </Link>
          </div>
        )}
      </div>

      {/* Digital Ticket Modal */}
      <DigitalTicket
        booking={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}
