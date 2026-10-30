import React from 'react';
import Link from 'next/link';
import { Ticket, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center">
                <Ticket size={15} />
              </div>
              <span className="text-base font-extrabold text-slate-900">
                Festivault
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed mb-3.5">
              Event and Festival Management Database System. Discover concerts, cultural gatherings, comedy shows, and reserve tickets with full transparency.
            </p>
            <div className="flex gap-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Next.js App
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                PostgreSQL Active
              </span>
            </div>
          </div>

          {/* Col 2: Discover */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Discover
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/events?type=past" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Past Events &amp; Reviews
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Check My Bookings
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Quick Nav &amp; Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Organizers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Organizers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Host an Event
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Organizer Guidelines
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Organizer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Notice */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Payment Information
            </h4>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg">
              <div className="text-slate-900 text-xs font-bold flex items-center gap-1.5 mb-1.5">
                <MapPin size={14} className="text-emerald-600" />
                <span>Pay at Event Counter</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Reserve your tickets online without upfront convenience charges. Complete payment at the venue entry counter when collecting physical wristbands.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5 flex flex-wrap justify-between items-center gap-3 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Festivault Event &amp; Festival Management System.
          </div>
          <div className="flex gap-4">
            <Link href="/menu" className="text-slate-500 hover:text-slate-700 transition-colors">Terms &amp; Conditions</Link>
            <Link href="/about" className="text-slate-500 hover:text-slate-700 transition-colors">About</Link>
            <Link href="/menu" className="text-slate-500 hover:text-slate-700 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
