'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import EventCard from '@/components/EventCard';
import EventModal from '@/components/EventModal';
import BookingModal from '@/components/BookingModal';
import DigitalTicket from '@/components/DigitalTicket';
import CustomDropdown from '@/components/CustomDropdown';
import {
  Search,
  Ticket,
  Shield,
  Calendar,
  ArrowRight,
  Music,
  Palette,
  Utensils,
  Globe,
  Trophy,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_ICONS = {
  Music: <Music size={18} className="text-blue-600" />,
  Arts: <Palette size={18} className="text-purple-600" />,
  Food: <Utensils size={18} className="text-amber-600" />,
  Cultural: <Globe size={18} className="text-emerald-600" />,
  Sports: <Trophy size={18} className="text-rose-600" />
};

export default function HomePage() {
  const router = useRouter();
  const { events, categories, bookings } = useApp();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.set('keyword', searchKeyword.trim());
    if (selectedCategory) params.set('category_id', selectedCategory);
    router.push(`/events?${params.toString()}`);
  };

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((e) => {
    const d = new Date(e.start_date);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });

  const featuredEvents = upcomingEvents.slice(0, 3);

  const dropdownCategoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({
      value: String(c.category_id),
      label: c.category_name,
      icon: CATEGORY_ICONS[c.category_name] || <Ticket size={16} />
    }))
  ];

  const totalReservedRevenue = bookings.reduce(
    (sum, b) => sum + (Number(b.total_price) || 0),
    0
  );

  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-white border-b border-slate-200 py-16 sm:py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Tag */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              Event &amp; Festival Management System
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto mb-4 leading-tight">
            Discover Events &amp; Festivals. Celebrate Together.
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Explore upcoming concerts, comedy nights, food carnivals, and cultural fests. Check adult and child pricing, reserve passes online, and pay at the event counter upon arrival.
          </p>

          {/* Hero Search Bar with Custom Dropdown */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row gap-2.5 items-center mb-8"
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search events, comedy, music..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <div className="w-full sm:w-56 shrink-0">
              <CustomDropdown
                options={dropdownCategoryOptions}
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                placeholder="All Categories"
                ariaLabel="Select event category"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors shrink-0 cursor-pointer"
            >
              <span>Search Events</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Action Links */}
          <div className="flex flex-wrap justify-center gap-2.5">
            <Link
              href="/events"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors"
            >
              Explore Events Catalog
            </Link>
            <Link
              href="/bookings"
              className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors"
            >
              Check My Bookings
            </Link>
          </div>
        </div>
      </section>

      {/* STATS STRIP - Flat cards, NO left-side bold border, NO shadows */}
      <section className="py-8 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4.5 text-center">
              <div className="text-2xl font-extrabold text-slate-900">
                {events.length}
              </div>
              <div className="text-slate-500 text-xs font-medium mt-1">
                Active Events &amp; Festivals
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4.5 text-center">
              <div className="text-2xl font-extrabold text-emerald-600">
                ₹{totalReservedRevenue.toLocaleString('en-IN')}
              </div>
              <div className="text-slate-500 text-xs font-medium mt-1">
                Counter Value Reserved
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4.5 text-center">
              <div className="text-2xl font-extrabold text-slate-900">
                {bookings.length}
              </div>
              <div className="text-slate-500 text-xs font-medium mt-1">
                Confirmed Bookings
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4.5 text-center">
              <div className="text-2xl font-extrabold text-slate-900">
                100%
              </div>
              <div className="text-slate-500 text-xs font-medium mt-1">
                Pay at Event Counter
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-1.5">
                Categories
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Browse by Category</h2>
            </div>
            <Link
              href="/events"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.category_id}
                href={`/events?category_id=${cat.category_id}`}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-2.5 hover:border-slate-300 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
                  {CATEGORY_ICONS[cat.category_name] || <Ticket size={18} />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {cat.category_name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 text-blue-600 text-xs font-semibold inline-flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED UPCOMING EVENTS */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-1.5">
                Upcoming
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Featured Events</h2>
            </div>
            <Link
              href="/events"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
            >
              See All {upcomingEvents.length} Events
            </Link>
          </div>

          {featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard
                  key={event.event_id}
                  event={event}
                  isPast={false}
                  onOpenDetails={handleOpenDetails}
                  onBookNow={handleBookNow}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
              <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-3">
                <Calendar size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                No Upcoming Events Listed
              </h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto mb-4 leading-relaxed">
                New festivals and concerts are being added to our schedule. Check back soon or browse our concluded events!
              </p>
              <Link
                href="/events?type=past"
                className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
              >
                Browse Past Events
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SYSTEM FEATURES HIGHLIGHTS - Clean flat cards */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
              Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2.5">
              Transparent Event Management
            </h2>
            <p className="text-slate-500 text-sm">
              Engineered for straightforward event discovery and management without complex setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center mb-3.5 text-slate-900">
                <Ticket size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Online Reservation
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Configure adult and child tickets with automated 50% child pricing calculations. Generate your digital entry voucher instantly.
              </p>
              <Link href="/events" className="text-blue-600 hover:text-blue-700 font-semibold text-xs inline-flex items-center gap-1">
                Explore Events &rarr;
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center mb-3.5 text-slate-900">
                <Shield size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Admin Management Portal
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Publish new festivals, upload banner images, review registered attendees, and track real-time bookings from a single console.
              </p>
              <Link href="/login?role=admin" className="text-blue-600 hover:text-blue-700 font-semibold text-xs inline-flex items-center gap-1">
                Admin Console &rarr;
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center mb-3.5 text-slate-900">
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Pay-at-Counter Guarantee
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Reserve your tickets without upfront convenience charges. Pay at the venue entry counter when picking up physical entry wristbands.
              </p>
              <Link href="/bookings" className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs inline-flex items-center gap-1">
                Lookup Tickets &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LOGIN BANNER */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Ready to Book Your Pass?
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-5 text-xs sm:text-sm">
              Sign in to manage your tickets, or create a free account to track upcoming festivals.
            </p>
            <div className="flex justify-center gap-2.5 flex-wrap">
              <Link
                href="/login"
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-colors"
              >
                Register Account
              </Link>
            </div>
          </div>
        </div>
      </section>

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
        }}
      />

      <DigitalTicket
        booking={activeDigitalTicket}
        onClose={() => setActiveDigitalTicket(null)}
      />
    </div>
  );
}
