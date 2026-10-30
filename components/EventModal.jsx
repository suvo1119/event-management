'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Hourglass,
  User,
  Languages,
  MapPin,
  X
} from 'lucide-react';

export default function EventModal({
  event,
  isOpen,
  onClose,
  onProceedToBooking
}) {
  const [modalAdults, setModalAdults] = useState(1);
  const [modalChildren, setModalChildren] = useState(0);

  if (!isOpen || !event) return null;

  const basePrice = Number(event.price) || 0;
  const childPrice = basePrice * 0.5;
  const totalPrice = modalAdults * basePrice + modalChildren * childPrice;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 shadow-2xl transition-all my-8"
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

        {/* Banner image header */}
        <div className="relative h-44 rounded-lg overflow-hidden mb-4 bg-slate-100">
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2.5 left-2.5 bg-white border border-slate-200 px-2 py-0.5 rounded text-xs text-slate-900 font-semibold">
            {event.category_name}
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-3.5">
          {event.title}
        </h2>

        {/* Grid of Event Specifics */}
        <div className="grid grid-cols-2 gap-2.5 bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-4 text-xs text-slate-700">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-500 shrink-0" />
            <span>Date: <strong className="text-slate-900">{event.start_date}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-500 shrink-0" />
            <span>Time: <strong className="text-slate-900">{event.time_slot || '07:30 PM'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Hourglass size={14} className="text-slate-500 shrink-0" />
            <span>Duration: <strong className="text-slate-900">{event.duration || '2 Hours'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-slate-500 shrink-0" />
            <span>Age: <strong className="text-slate-900">{event.age_limit || 'All Ages'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Languages size={14} className="text-slate-500 shrink-0" />
            <span>Languages: <strong className="text-slate-900">{event.languages || 'English'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-500 shrink-0" />
            <span className="truncate">Venue: <strong className="text-slate-900">{event.location || 'Auditorium'}</strong></span>
          </div>
        </div>

        {/* Description */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
          About The Event
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed mb-4.5 whitespace-pre-line">
          {event.description || 'No detailed description provided.'}
        </p>

        {/* Ticket counter inside Modal */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4.5 flex justify-around items-center">
          <div className="text-center">
            <span className="text-[11px] text-slate-500 block mb-1">
              Adults (₹{basePrice})
            </span>
            <input
              type="number"
              min="1"
              value={modalAdults}
              onChange={(e) => setModalAdults(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-18 text-center py-1 px-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-500 block mb-1">
              Children (₹{childPrice})
            </span>
            <input
              type="number"
              min="0"
              value={modalChildren}
              onChange={(e) => setModalChildren(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-18 text-center py-1 px-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors cursor-pointer"
          onClick={() => {
            onClose();
            onProceedToBooking(event, modalAdults, modalChildren, totalPrice);
          }}
        >
          Proceed to Booking &bull; ₹{totalPrice}
        </button>
      </div>
    </div>
  );
}
