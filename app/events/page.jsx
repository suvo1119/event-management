'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import EventCard from '@/components/EventCard';
import EventModal from '@/components/EventModal';
import BookingModal from '@/components/BookingModal';
import DigitalTicket from '@/components/DigitalTicket';
import CustomDropdown from '@/components/CustomDropdown';
import {
  Search,
  RotateCcw,
  Ticket,
  Calendar,
  Music,
  Palette,
  Utensils,
  Globe,
  Trophy
} from 'lucide-react';

const CATEGORY_ICONS = {
  Music: <Music size={16} className="text-blue-600" />,
  Arts: <Palette size={16} className="text-purple-600" />,
  Food: <Utensils size={16} className="text-amber-600" />,
  Cultural: <Globe size={16} className="text-emerald-600" />,
  Sports: <Trophy size={16} className="text-rose-600" />
};

function EventsContent() {
  const searchParams = useSearchParams();
  const { events, categories, bookings } = useApp();

  const qKeyword = searchParams.get('keyword') || '';
  const qCategory = searchParams.get('category_id') || '';
  const qType = searchParams.get('type') || '';

  const [activeTab, setActiveTab] = useState(qType === 'past' ? 'past' : 'upcoming'); // 'upcoming' | 'past'
  const [keyword, setKeyword] = useState(qKeyword);
  const [categoryId, setCategoryId] = useState(qCategory);
  const [dateFilter, setDateFilter] = useState('');

  // Ticket Lookup Section state
  const [lookupEmail, setLookupEmail] = useState('');
  const [matchedUserBookings, setMatchedUserBookings] = useState([]);
  const [hasQueriedBookings, setHasQueriedBookings] = useState(false);

  // Modal states
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [bookingModalState, setBookingModalState] = useState({
    isOpen: false,
    event: null,
    adults: 1,
    children: 0,
    totalPrice: 0
  });
  const [activeDigitalTicket, setActiveDigitalTicket] = useState(null);

  const handleOpenDetails = (event, adults = 1, children = 0) => {
    setSelectedEventForModal(event);
  };

  const handleBookNow = (event, adults = 1, children = 0, totalPrice = 0) => {
    setBookingModalState({
      isOpen: true,
      event,
      adults,
      children,
      totalPrice
    });
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategoryId('');
    setDateFilter('');
  };

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const filteredEvents = useMemo(() => {
    const list = Array.isArray(events) ? events : [];
    return list.filter((ev) => {
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        const matchesTitle = ev.title?.toLowerCase().includes(q);
        const matchesDesc = ev.description?.toLowerCase().includes(q);
        const matchesLoc = ev.location?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }
      if (categoryId && String(ev.category_id) !== String(categoryId)) {
        return false;
      }
      if (dateFilter && ev.start_date !== dateFilter) {
        return false;
      }
      return true;
    });
  }, [events, keyword, categoryId, dateFilter]);

  const upcomingEvents = useMemo(() => {
    return filteredEvents.filter((ev) => {
      const d = new Date(ev.start_date);
      d.setHours(0, 0, 0, 0);
      return d >= today;
    });
  }, [filteredEvents, today]);

  const pastEvents = useMemo(() => {
    return filteredEvents.filter((ev) => {
      const d = new Date(ev.start_date);
      d.setHours(0, 0, 0, 0);
      return d < today;
    });
  }, [filteredEvents, today]);

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (!lookupEmail.trim()) return;

    const norm = lookupEmail.trim().toLowerCase();
    const safeBookingsList = Array.isArray(bookings) ? bookings : [];
    const userMatches = safeBookingsList.filter((b) => b.user_email === norm);
    setMatchedUserBookings(userMatches);
    setHasQueriedBookings(true);
  };

  const safeCatList = Array.isArray(categories) ? categories : [];
  const dropdownCategoryOptions = [
    { value: '', label: 'All Categories' },
    ...safeCatList.map((c) => ({
      value: String(c.category_id),
      label: c.category_name,
      icon: CATEGORY_ICONS[c.category_name] || <Ticket size={16} />
    }))
  ];

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Tabs */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-1.5">
              Festival Directory
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Events &amp; Festivals
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Browse upcoming festivals, compare ticket options, or share feedback on concluded events.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('past')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
            >
              Past &amp; Reviews ({pastEvents.length})
            </button>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR with Custom Dropdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Artist, venue, title..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <CustomDropdown
              options={dropdownCategoryOptions}
              value={categoryId}
              onChange={(val) => setCategoryId(val)}
              placeholder="All Categories"
              ariaLabel="Filter by category"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            {(keyword || categoryId || dateFilter) ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            ) : (
              <div className="hidden lg:block text-xs text-slate-400 py-2.5 text-center">
                Filters active
              </div>
            )}
          </div>
        </div>

        {/* EVENTS GRID */}
        {activeTab === 'upcoming' ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Upcoming Events ({upcomingEvents.length})
              </h2>
              <span className="text-xs text-slate-500">
                Scheduled for today and future dates
              </span>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.event_id}
                    event={event}
                    isPast={false}
                    onOpenDetails={handleOpenDetails}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center mb-12">
                <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-3">
                  <Calendar size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  No Events Listed Right Now
                </h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto mb-4 leading-relaxed">
                  We are actively curating upcoming festivals and exhibitions. Check back soon for announcements or explore concluded shows!
                </p>
                <button
                  type="button"
                  onClick={() => setFilterType('past')}
                  className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer"
                >
                  View Concluded Festivals
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center mb-12">
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  No upcoming events match your filter
                </h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4 leading-relaxed">
                  Try adjusting your search keyword or clearing the category and date filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Past Events &amp; Ratings ({pastEvents.length})
              </h2>
              <span className="text-xs text-slate-500">
                Concluded events where attendees can submit reviews
              </span>
            </div>

            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.event_id}
                    event={event}
                    isPast={true}
                    onOpenDetails={handleOpenDetails}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center mb-12">
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  No past events found
                </h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                  Concluded festivals will appear here once their scheduled dates pass.
                </p>
              </div>
            )}
          </div>
        )}

        {/* CHECK MY BOOKED TICKETS SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-1.5">
            <Ticket size={20} className="text-slate-900" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Check My Booked Tickets
            </h3>
          </div>
          <p className="text-slate-500 text-xs mb-4">
            Enter your account email to review passes reserved under your name or open digital boarding passes.
          </p>

          <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row gap-2.5 mb-5 max-w-lg">
            <input
              type="email"
              value={lookupEmail}
              onChange={(e) => {
                setLookupEmail(e.target.value);
                setHasQueriedBookings(false);
              }}
              placeholder="e.g. attendee@example.com"
              required
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
            >
              View Bookings
            </button>
          </form>

          {/* Bookings result cards */}
          {hasQueriedBookings && (
            <div>
              {matchedUserBookings.length > 0 ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-3">
                    Found {matchedUserBookings.length} booking(s) for {lookupEmail}:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {matchedUserBookings.map((b) => (
                      <div
                        key={b.booking_id}
                        className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-1.5"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-sm font-bold text-slate-900">
                              {b.title}
                            </strong>
                            <div className="text-slate-500 text-xs">
                              #{b.booking_id} &bull; {b.category_name}
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Pay at Counter
                          </span>
                        </div>

                        <div className="text-xs text-slate-700">
                          Date: <strong className="text-slate-900">{b.start_date}</strong>
                        </div>

                        <div className="text-xs text-slate-600">
                          Tickets: <strong>{b.adults ?? 1}</strong> Adult,{' '}
                          <strong>{b.children ?? 0}</strong> Child
                        </div>

                        <div className="text-sm font-extrabold text-emerald-600">
                          Total: ₹{b.total_price}
                        </div>

                        <div className="flex justify-between items-center mt-1.5 pt-2 border-t border-slate-200">
                          <span className="text-[10px] text-slate-400">
                            Booked on {new Date(b.booking_date).toLocaleDateString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveDigitalTicket(b)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Digital Pass
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs">
                  No bookings found for <strong>{lookupEmail}</strong>. Reserve your tickets above.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EventModal
        event={selectedEventForModal}
        isOpen={Boolean(selectedEventForModal)}
        onClose={() => setSelectedEventForModal(null)}
        onProceedToBooking={handleBookNow}
      />

      <BookingModal
        isOpen={bookingModalState.isOpen}
        event={bookingModalState.event}
        adults={bookingModalState.adults}
        childrenCount={bookingModalState.children}
        onClose={() =>
          setBookingModalState({
            isOpen: false,
            event: null,
            adults: 1,
            children: 0,
            totalPrice: 0
          })
        }
        onBookingConfirmed={(booking) => {
          setActiveDigitalTicket(booking);
          setHasQueriedBookings(true);
        }}
      />

      <DigitalTicket
        booking={activeDigitalTicket}
        onClose={() => setActiveDigitalTicket(null)}
      />
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-xs text-slate-500">
          Loading Events...
        </div>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
