import React from 'react';
import Link from 'next/link';
import { Calendar, Tag, Ticket, Star, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Festivault - Event and Festival Management Database System',
  description: 'Overview of the Festivault architecture, database schema, and festival management features.'
};

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
            Architecture Overview
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            About Festivault
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            A full-stack Event and Festival Management Database System built with Next.js App Router, React 19, and PostgreSQL.
          </p>
        </div>

        {/* Overview Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            System Purpose &amp; Goals
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3.5">
            Festivault was engineered to address common challenges in festival administration and attendee ticket booking. Traditional setups often mandate external server installations or introduce booking friction.
          </p>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            This application provides a zero-setup architecture: visitors can browse categories (Music, Arts, Food, Cultural, Sports), calculate adult &amp; child discounts in real-time, generate digital entry vouchers, and pay at the venue entrance counter. Organizers have access to a management console with real-time KPI metrics, user management, and instant event publishing.
          </p>
        </div>

        {/* Database Entities */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Database Schema &amp; Entities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={15} className="text-slate-900" />
                <span className="text-sm font-bold text-slate-900">
                  Events Entity
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Stores <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">event_id</code>, <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">title</code>, <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">start_date</code>, <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">location</code>, <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">category_id</code>, <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">price</code>, <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">duration</code>, and <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">languages</code>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={15} className="text-slate-900" />
                <span className="text-sm font-bold text-slate-900">
                  Categories Entity
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Pre-seeded with Music, Arts, Food, Cultural, and Sports for normalized taxonomy and filtering.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ticket size={15} className="text-slate-900" />
                <span className="text-sm font-bold text-slate-900">
                  Bookings Entity
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Records <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">booking_id</code>, <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">user_email</code>, <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">event_id</code>, <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">adults</code>, <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">children</code>, and <code className="bg-slate-200/60 px-1 py-0.5 rounded text-[11px] text-slate-800">total_price</code>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star size={15} className="text-slate-900" />
                <span className="text-sm font-bold text-slate-900">
                  Reviews Entity
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Enables attendees to rate completed events (1-5 stars) and record feedback comments.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors"
          >
            <span>Explore Events Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
