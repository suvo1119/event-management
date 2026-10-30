'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import DigitalTicket from '@/components/DigitalTicket';
import {
  Calendar,
  Clock,
  Hourglass,
  MapPin,
  User,
  ArrowLeft,
  Minus,
  Plus
} from 'lucide-react';

export default function DedicatedBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { events, currentUser, createBooking } = useApp();

  const event = useMemo(() => {
    if (!params?.id) return null;
    return (Array.isArray(events) ? events : []).find((e) => String(e.event_id) === String(params.id)) || null;
  }, [params, events]);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const activeEmail = emailInput !== '' ? emailInput : (currentUser?.email || '');

  if (!event) {
    return (
      <div className="py-16 text-center text-slate-500">
        <p className="text-sm">Loading Event Details...</p>
        <Link
          href="/events"
          className="inline-block mt-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-md px-3 py-1.5 text-xs font-semibold"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const basePrice = Number(event.price) || 0;
  const childPrice = basePrice * 0.5;
  const adultsTotal = adults * basePrice;
  const childrenTotal = children * childPrice;
  const grandTotal = adultsTotal + childrenTotal;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!activeEmail.trim()) {
      alert('Please enter your recipient account email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await createBooking({
        eventId: event.event_id,
        email: activeEmail.trim().toLowerCase(),
        adults,
        children,
        total_price: grandTotal
      });
      setConfirmedBooking(newBooking);
    } catch {
      // handled by context toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/events"
            className="text-slate-500 hover:text-slate-800 text-xs sm:text-sm inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Events Catalog</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Event Overview Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
            <div className="relative h-44 rounded-lg overflow-hidden mb-4 bg-slate-100">
              <img
                src={event.banner_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-white border border-slate-200 px-2 py-0.5 rounded text-xs text-slate-900 font-semibold">
                {event.category_name}
              </div>
            </div>

            <h1 className="text-xl font-bold text-slate-900 mb-2.5">
              {event.title}
            </h1>

            <div className="space-y-1.5 text-xs text-slate-600 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400 shrink-0" />
                <span>Date: <strong className="text-slate-900">{event.start_date}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400 shrink-0" />
                <span>Time: <strong className="text-slate-900">{event.time_slot || '07:30 PM'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Hourglass size={13} className="text-slate-400 shrink-0" />
                <span>Duration: <strong className="text-slate-900">{event.duration || '2 Hours'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">Venue: <strong className="text-slate-900">{event.location || 'Main Auditorium'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-slate-400 shrink-0" />
                <span>Age Limit: <strong className="text-slate-900">{event.age_limit || 'All Ages'}</strong></span>
              </div>
            </div>

            <hr className="border-slate-200 my-3.5" />

            <h4 className="text-xs font-bold text-slate-900 mb-1.5">
              About This Festival
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Right Column: Ticket Reservation Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
            <div className="mb-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-1">
                Reservation
              </span>
              <h2 className="text-xl font-bold text-slate-900">Ticket Options</h2>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3.5">
              {/* Adults Selector */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">Adult Pass</div>
                  <div className="text-xs text-emerald-600 font-semibold">
                    {basePrice > 0 ? `₹${basePrice} each` : 'Free'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded bg-white border border-slate-300 text-slate-800 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    aria-label="Decrease adults"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-xs font-bold min-w-5 text-center text-slate-900">
                    {adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 text-slate-800 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    aria-label="Increase adults"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Children Selector */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">Child Pass (Age 3-12)</div>
                  <div className="text-xs text-blue-600 font-semibold">
                    {childPrice > 0 ? `₹${childPrice} (50% Off)` : 'Free'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-7 h-7 rounded bg-white border border-slate-300 text-slate-800 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    aria-label="Decrease children"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-xs font-bold min-w-5 text-center text-slate-900">
                    {children}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 text-slate-800 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    aria-label="Increase children"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-600 space-y-1.5">
                <div className="flex justify-between">
                  <span>Adults ({adults} &times; ₹{basePrice}):</span>
                  <strong className="text-slate-900 font-semibold">₹{adultsTotal}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Children ({children} &times; ₹{childPrice}):</span>
                  <strong className="text-slate-900 font-semibold">₹{childrenTotal}</strong>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Total Due:</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Pay at Counter Guarantee */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div className="text-emerald-800 font-bold text-xs flex items-center gap-1.5 mb-0.5">
                  <MapPin size={13} className="text-emerald-700 shrink-0" />
                  <span>Pay at Event Entry Counter</span>
                </div>
                <div className="text-slate-600 text-xs">
                  Pay ₹{grandTotal} when collecting physical wristbands at the venue desk.
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attendee Email Address *
                </label>
                <input
                  type="email"
                  value={activeEmail}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Reserving...' : `Confirm Reservation • ₹${grandTotal}`}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Digital Ticket Modal on Confirmation */}
      <DigitalTicket
        booking={confirmedBooking}
        onClose={() => {
          setConfirmedBooking(null);
          router.push('/bookings');
        }}
      />
    </div>
  );
}
