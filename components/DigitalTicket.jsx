'use client';

import React from 'react';
import { Ticket, Printer, X } from 'lucide-react';

export default function DigitalTicket({ booking, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
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
          className="no-print absolute top-4 right-4 w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center cursor-pointer transition-colors border border-slate-200"
          onClick={onClose}
          aria-label="Close ticket"
        >
          <X size={16} />
        </button>

        {/* Boarding Pass Container */}
        <div id="printable-ticket" className="bg-white border border-slate-300 rounded-xl overflow-hidden">
          {/* Header Strip */}
          <div className="bg-slate-900 p-3.5 sm:p-4 text-white flex justify-between items-center">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Festivault Entry Voucher
              </div>
              <div className="text-base font-extrabold">
                #{booking.booking_id}
              </div>
            </div>
            <Ticket size={22} className="text-white shrink-0" />
          </div>

          {/* Ticket Body */}
          <div className="p-4 sm:p-5">
            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 mb-2">
              {booking.category_name || 'General'}
            </span>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3.5">
              {booking.title}
            </h3>

            <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700 mb-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Date
                </span>
                <strong className="text-slate-900">{booking.start_date}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Time
                </span>
                <strong className="text-slate-900">{booking.time_slot || '07:30 PM'}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Venue
                </span>
                <strong className="text-slate-900 truncate block">{booking.location || 'Main Auditorium'}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Attendee
                </span>
                <span className="text-slate-900 text-xs truncate block font-medium">
                  {booking.user_email}
                </span>
              </div>
            </div>

            {/* Pass Summary Strip */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 sm:p-3 flex justify-between items-center mb-4">
              <div>
                <span className="text-[11px] text-slate-500 block">Reserved Tickets:</span>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  Adults: {booking.adults ?? 1} &bull; Children: {booking.children ?? 0}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Due at Counter
                </span>
                <div className="text-base sm:text-lg font-extrabold text-emerald-600">
                  ₹{booking.total_price}
                </div>
              </div>
            </div>

            {/* Barcode representation */}
            <div className="text-center pt-1">
              <div className="flex justify-center gap-0.5 sm:gap-1 h-7 items-stretch">
                {[3, 1, 4, 2, 5, 2, 4, 1, 5, 2, 3, 4, 2, 5, 1, 3, 2, 4, 2, 3, 4, 2, 4, 3].map(
                  (w, i) => (
                    <div
                      key={i}
                      style={{ width: w }}
                      className={i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-300'}
                    />
                  )
                )}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 tracking-wider mt-1.5 font-mono">
                SCAN AT ENTRY DESK &bull; #{booking.booking_id}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="no-print flex gap-2.5 mt-4">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Pass</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
