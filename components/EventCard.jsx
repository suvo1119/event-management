'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Minus,
  Plus,
  Star
} from 'lucide-react';
import CustomDropdown from './CustomDropdown';

export default function EventCard({
  event,
  isPast = false,
  onOpenDetails,
  onBookNow
}) {
  const { createReview } = useApp();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // Review form state for past events
  const [rating, setRating] = useState('5');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = eventDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return eventDate.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewEmail.trim()) {
      alert('Please enter your email to submit a review.');
      return;
    }
    setSubmittingReview(true);
    try {
      await createReview({
        event_id: event.event_id,
        user_email: reviewEmail.trim(),
        rating: Number(rating),
        comment: reviewComment.trim()
      });
      setReviewComment('');
      setReviewEmail('');
    } catch {
      // handled by context toast
    } finally {
      setSubmittingReview(false);
    }
  };

  const basePrice = Number(event.price) || 0;
  const childPrice = basePrice * 0.5;
  const totalPrice = adults * basePrice + children * childPrice;

  const fallbackBanner =
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80';

  const ratingOptions = [
    { value: '5', label: '5 Stars (Excellent)', icon: <Star size={14} className="text-amber-500 fill-amber-500" /> },
    { value: '4', label: '4 Stars (Very Good)', icon: <Star size={14} className="text-amber-500 fill-amber-500" /> },
    { value: '3', label: '3 Stars (Average)', icon: <Star size={14} className="text-amber-500 fill-amber-500" /> },
    { value: '2', label: '2 Stars (Fair)', icon: <Star size={14} className="text-amber-500 fill-amber-500" /> },
    { value: '1', label: '1 Star (Poor)', icon: <Star size={14} className="text-amber-500 fill-amber-500" /> }
  ];

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden h-full transition-colors hover:border-slate-300">
      {/* Banner Image Container */}
      <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
        <img
          src={event.banner_url || fallbackBanner}
          alt={event.title}
          className="w-full h-full object-cover block"
          onError={(e) => {
            e.target.src = fallbackBanner;
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 border border-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {event.category_name || 'General'}
          </span>
        </div>

        {/* Date Tag */}
        <div className="absolute bottom-2.5 right-3 bg-white/95 border border-slate-200 rounded px-2 py-0.5 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <Calendar size={13} className="text-slate-500" />
          <span>{formatEventDate(event.start_date)}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Meta Header */}
        <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
          <span className="flex items-center gap-1 text-rose-600 font-semibold">
            <Heart size={13} className="fill-rose-600 text-rose-600" />
            <span>{event.interested_count || 95} interested</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            <span>{event.time_slot || '07:30 PM'}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">
          {event.title}
        </h3>

        {/* Location info */}
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-3 truncate">
          <MapPin size={13} className="shrink-0" />
          <span className="truncate">{event.location || 'Main Auditorium'}</span>
        </div>

        {/* Price Display */}
        <div className="flex items-baseline gap-1.5 mb-3.5">
          <span className={`text-lg font-extrabold ${basePrice > 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
            {basePrice > 0 ? `₹${basePrice}` : 'Free Entry'}
          </span>
          {basePrice > 0 && (
            <span className="text-xs text-slate-500">/ adult pass</span>
          )}
        </div>

        {!isPast ? (
          /* Upcoming Event ticket controls */
          <div className="mt-auto space-y-3">
            {/* Ticket Counter Controls */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex justify-between items-center">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Adults (₹{basePrice})
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-800 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    aria-label="Decrease adults"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-xs font-bold w-4 text-center text-slate-800">
                    {adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-800 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    aria-label="Increase adults"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Child (₹{childPrice})
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-800 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    aria-label="Decrease children"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-xs font-bold w-4 text-center text-slate-800">
                    {children}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-800 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    aria-label="Increase children"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenDetails(event, adults, children)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg py-2 text-xs font-semibold border border-slate-200 transition-colors"
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => onBookNow(event, adults, children, totalPrice)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2 text-xs font-semibold transition-colors"
              >
                Book (₹{totalPrice})
              </button>
            </div>
          </div>
        ) : (
          /* Past Event Review Form with Custom Dropdown */
          <div className="mt-auto bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">
                Completed
              </span>
              <span className="text-xs text-slate-500">Rate Event</span>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-2">
              <CustomDropdown
                options={ratingOptions}
                value={rating}
                onChange={(val) => setRating(val)}
                placeholder="Select Rating"
                ariaLabel="Select Event Rating"
              />

              <input
                type="email"
                value={reviewEmail}
                onChange={(e) => setReviewEmail(e.target.value)}
                placeholder="Your account email..."
                required
                className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
              />

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your feedback..."
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900 resize-none"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md py-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
