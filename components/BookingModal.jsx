'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Ticket, MapPin, X } from 'lucide-react';

export default function BookingModal({
  isOpen,
  onClose,
  event,
  adults = 1,
  children = 0,
  onBookingConfirmed
}) {
  const { currentUser, createBooking } = useApp();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  if (!isOpen || !event) return null;

  const basePrice = Number(event.price) || 0;
  const childPrice = basePrice * 0.5;
  const adultsTotal = adults * basePrice;
  const childrenTotal = children * childPrice;
  const grandTotal = adultsTotal + childrenTotal;

  const handleConfirm = async (e) => {
    e.preventDefault();

    const finalEmail = (email || currentUser?.email || '').trim().toLowerCase();
    if (!finalEmail) {
      alert('Please provide a valid email address for your ticket receipt.');
      return;
    }

    setSubmitting(true);
    try {
      const newBooking = await createBooking({
        eventId: event.event_id,
        email: finalEmail,
        adults,
        children,
        total_price: grandTotal
      });

      onClose();
      if (onBookingConfirmed) {
        onBookingConfirmed(newBooking);
      }
    } catch {
      // handled by toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-2xl transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center cursor-pointer transition-colors border border-slate-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="text-center mb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-2.5">
            <Ticket size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Booking Summary
          </h2>
          <p className="text-slate-900 font-semibold text-sm mt-0.5">
            {event.title}
          </p>
        </div>

        {/* Breakdown Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-4 text-xs sm:text-sm">
          <div className="flex justify-between mb-2 text-slate-600">
            <span>Adults ({adults} &times; ₹{basePrice}):</span>
            <strong className="text-slate-900 font-semibold">₹{adultsTotal}</strong>
          </div>

          <div className="flex justify-between mb-2.5 text-slate-600">
            <span>Children ({children} &times; ₹{childPrice}):</span>
            <strong className="text-slate-900 font-semibold">₹{childrenTotal}</strong>
          </div>

          <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center">
            <span className="font-bold text-slate-900">
              Total Payable:
            </span>
            <span className="text-lg font-extrabold text-emerald-600">
              ₹{grandTotal}
            </span>
          </div>
        </div>

        {/* Counter Notice Box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <div className="text-emerald-800 font-bold text-xs uppercase flex items-center gap-1.5 mb-1">
            <MapPin size={13} className="text-emerald-700 shrink-0" />
            <span>Payment at Event Entry Counter</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">
            No advance online card payment required. Present this reservation at the entrance desk to pay and collect your passes.
          </p>
        </div>

        {/* Confirmation Form */}
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recipient Account Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Confirming...' : 'Confirm Ticket Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
}
