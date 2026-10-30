'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import CustomDropdown from '@/components/CustomDropdown';
import {
  Shield,
  Plus,
  Ticket,
  Users,
  Star,
  Calendar,
  Upload,
  Trash2,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertCircle,
  Clock,
  MapPin,
  Music,
  Palette,
  Utensils,
  Globe,
  Trophy,
  Loader2,
  ImageIcon
} from 'lucide-react';
import { compressImageForShowcase } from '@/lib/image-compress';

const CATEGORY_ICONS = {
  Music: <Music size={15} className="text-blue-600" />,
  Arts: <Palette size={15} className="text-purple-600" />,
  Food: <Utensils size={15} className="text-amber-600" />,
  Cultural: <Globe size={15} className="text-emerald-600" />,
  Sports: <Trophy size={15} className="text-red-600" />
};

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    events,
    categories,
    bookings,
    users,
    reviews,
    isAdmin,
    login,
    logout,
    createEvent,
    deleteEvent,
    deleteBooking,
    deleteReview,
    deleteUser
  } = useApp();

  const safeEvents = useMemo(() => (Array.isArray(events) ? events : []), [events]);
  const safeCategories = useMemo(() => (Array.isArray(categories) ? categories : []), [categories]);
  const safeBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);
  const safeUsers = useMemo(() => (Array.isArray(users) ? users : []), [users]);
  const safeReviews = useMemo(() => (Array.isArray(reviews) ? reviews : []), [reviews]);

  const tabParam = searchParams.get('tab');
  const initialTab = (tabParam && ['create', 'bookings', 'users', 'reviews', 'events'].includes(tabParam)) ? tabParam : 'create';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Create Event Form state
  const [newTitle, setNewTitle] = useState('');
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [newDuration, setNewDuration] = useState('3 Hours');
  const [newAgeLimit, setNewAgeLimit] = useState('16yrs +');
  const [newLanguages, setNewLanguages] = useState('English, Hindi');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('1');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('07:30 PM');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState('499');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadNote, setUploadNote] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadNote({ status: 'info', text: 'Compressing image for showcase display...' });

    try {
      // 1. In-browser canvas compression (resizes to showcase dimensions max 1200x675, quality 0.8)
      const compressedDataUrl = await compressImageForShowcase(file, {
        maxWidth: 1200,
        maxHeight: 675,
        quality: 0.8
      });

      // Show immediate local preview
      setBannerPreview(compressedDataUrl);
      setUploadNote({ status: 'info', text: 'Uploading to ImageKit CDN...' });

      // 2. Upload to /api/upload (ImageKit or graceful fallback)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: compressedDataUrl,
          fileName: file.name.replace(/\.[^/.]+$/, '')
        })
      });

      const data = await res.json();
      if (data.success && data.url) {
        setNewBannerUrl(data.url);
        setUploadNote({
          status: 'success',
          text: data.source === 'imagekit'
            ? 'Uploaded to ImageKit CDN (compressed for showcase)'
            : 'Compressed for showcase dimensions'
        });
      } else {
        setNewBannerUrl(compressedDataUrl);
        setUploadNote({ status: 'success', text: 'Showcase-compressed image ready' });
      }
    } catch (err) {
      console.error('Image compression/upload failed:', err);
      setUploadNote({ status: 'error', text: 'Compression failed: ' + (err.message || 'Unknown error') });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAdminUnlock = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await login({ role: 'admin', password: adminPasswordInput });
      setAdminPasswordInput('');
    } catch (err) {
      setLoginError(err.message || 'Incorrect Admin Password');
    }
  };

  const handleCreateEventSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate || !newCategory) {
      alert('Please fill in title, date, and category.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createEvent({
        title: newTitle.trim(),
        banner_url:
          newBannerUrl ||
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
        duration: newDuration.trim(),
        age_limit: newAgeLimit.trim(),
        languages: newLanguages.trim(),
        description: newDescription.trim(),
        category_id: Number(newCategory),
        start_date: newDate,
        time_slot: newTime,
        location: newLocation.trim() || 'Grand Amphitheatre',
        price: Number(newPrice) || 0
      });

      setNewTitle('');
      setNewBannerUrl('');
      setBannerPreview('');
      setNewDescription('');
      setNewLocation('');
      setActiveTab('events');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRevenue = useMemo(() => {
    return safeBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
  }, [safeBookings]);

  const categoryDropdownOptions = safeCategories.map((c) => ({
    value: String(c.category_id),
    label: c.category_name,
    icon: CATEGORY_ICONS[c.category_name] || <Ticket size={14} />
  }));

  // Non-admin Gate
  if (!isAdmin) {
    return (
      <div className="py-20 px-4 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-md w-full p-8 text-center bg-white border border-slate-200 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1.5">
            Admin Access Required
          </h2>
          <p className="text-slate-500 text-xs mb-6">
            Enter the administrator passcode to access event publishing, booking management, and metrics.
          </p>

          <form onSubmit={handleAdminUnlock} className="space-y-3.5">
            <div>
              <input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Enter administrator passcode..."
                required
                className="w-full text-center text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
              />
            </div>

            {loginError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Unlock Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                Admin Console
              </span>
              <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Live Database Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1.5">
              Management Portal
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/events')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Browse Catalog</span>
            </button>
          </div>
        </div>

        {/* Flat KPI Metric Cards - NO left-side bold borders, NO shadows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
              <span>Bookings</span>
              <Ticket size={14} className="text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {safeBookings.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Attendee reservations
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
              <span>Total Revenue</span>
              <span className="text-xs font-bold text-emerald-600">₹</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Pay-at-Counter expected
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
              <span>Registered Users</span>
              <Users size={14} className="text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {safeUsers.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              User profiles
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
              <span>Reviews</span>
              <Star size={14} className="text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {safeReviews.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Attendee feedback
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
              <span>Catalog Events</span>
              <Calendar size={14} className="text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {safeEvents.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Active listings
            </div>
          </div>
        </div>

        {/* Section Segmented Tabs */}
        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 inline-flex flex-wrap gap-1 mb-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Plus size={14} />
            <span>Create Event</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Ticket size={14} />
            <span>Bookings ({safeBookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Users size={14} />
            <span>Registered Users ({safeUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Star size={14} />
            <span>Reviews ({safeReviews.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Calendar size={14} />
            <span>Manage Events ({safeEvents.length})</span>
          </button>
        </div>

        {/* TAB 1: CREATE NEW EVENT with 2-Column Responsive Layout & Live Preview */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Publish New Event</h2>
                <p className="text-slate-500 text-xs mt-1">
                  Fill out the parameters below. Once submitted, the event will instantly appear in the live catalog.
                </p>
              </div>

              <form onSubmit={handleCreateEventSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Symphony Under the Stars"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>

                {/* Banner Upload with Preview and Showcase Compression Feedback */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Showcase Banner Image
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Compressed to 1200×675 (16:9)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploadingImage}
                      className="flex-1 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer p-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                    <input
                      type="url"
                      value={newBannerUrl}
                      onChange={(e) => {
                        setNewBannerUrl(e.target.value);
                        setBannerPreview(e.target.value);
                      }}
                      placeholder="Or paste direct image URL..."
                      className="flex-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  {/* Upload / Compression Status feedback */}
                  {isUploadingImage && (
                    <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 p-2.5 rounded-lg mb-2">
                      <Loader2 size={14} className="animate-spin text-blue-600" />
                      <span>Compressing for showcase display &amp; uploading...</span>
                    </div>
                  )}

                  {uploadNote && !isUploadingImage && (
                    <div
                      className={`flex items-center justify-between gap-2 text-xs p-2.5 rounded-lg mb-2 border ${
                        uploadNote.status === 'success'
                          ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                          : uploadNote.status === 'error'
                          ? 'text-red-800 bg-red-50 border-red-200'
                          : 'text-blue-800 bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {uploadNote.status === 'success' ? (
                          <CheckCircle2 size={14} className="text-emerald-600" />
                        ) : (
                          <AlertCircle size={14} className="text-red-600" />
                        )}
                        <span>{uploadNote.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadNote(null)}
                        className="text-slate-400 hover:text-slate-700 text-sm px-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Grid 2-col inputs with CustomDropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Category *
                    </label>
                    <CustomDropdown
                      options={categoryDropdownOptions}
                      value={newCategory}
                      onChange={(val) => setNewCategory(val)}
                      placeholder="Select category"
                      ariaLabel="Event category"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 07:30 PM"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="e.g. 3 Hours"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Age Limit
                    </label>
                    <input
                      type="text"
                      value={newAgeLimit}
                      onChange={(e) => setNewAgeLimit(e.target.value)}
                      placeholder="e.g. 16yrs + or All Ages"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Languages
                    </label>
                    <input
                      type="text"
                      value={newLanguages}
                      onChange={(e) => setNewLanguages(e.target.value)}
                      placeholder="e.g. English, Hindi"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Venue Location *
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Main Amphitheatre"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Adult Ticket Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="499"
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Event Description *
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide performer lineup, schedule, and entry instructions..."
                    rows={3}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-slate-900 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Event to Database'}
                </button>
              </form>
            </div>

            {/* Live Showcase Preview Column */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Catalog Preview
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Real-time Card
                </span>
              </div>

              {/* Event Card Mockup */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="aspect-[16/9] w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={
                      bannerPreview ||
                      newBannerUrl ||
                      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80'
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 text-slate-900 border border-slate-200">
                      {categories.find((c) => String(c.category_id) === String(newCategory))?.category_name || 'Music'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-900 text-white">
                      {Number(newPrice) > 0 ? `₹${newPrice}` : 'Free'}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {newTitle.trim() || 'Your Event Title'}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {newDescription.trim() || 'Event schedule, artists, and entry guidelines will appear here...'}
                  </p>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{newDate || 'Select Date'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      <span>{newTime || '07:30 PM'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <MapPin size={13} className="text-slate-400" />
                      <span className="truncate">{newLocation.trim() || 'Grand Amphitheatre'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Showcase Compression Spec:</div>
                <div className="text-[11px] text-slate-500">
                  • Max display resolution: 1200 × 675 px (16:9 ratio)<br />
                  • Target CDN folder: ImageKit <code className="text-slate-800">/event-managment</code><br />
                  • Auto-generated attendee booking pass available immediately upon save
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS TABLE */}
        {activeTab === 'bookings' && (
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Attendee Bookings</h3>
                <span className="text-xs text-slate-500">
                  Live registrations across all festivals
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 px-3 font-semibold">ID</th>
                    <th className="py-2.5 px-3 font-semibold">Email</th>
                    <th className="py-2.5 px-3 font-semibold">Event</th>
                    <th className="py-2.5 px-3 font-semibold">Tickets</th>
                    <th className="py-2.5 px-3 font-semibold">Total Price</th>
                    <th className="py-2.5 px-3 font-semibold">Date</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeBookings.map((b) => (
                    <tr key={b.booking_id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        #{b.booking_id}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {b.user_email}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {b.title}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {b.adults ?? 1} Adult, {b.children ?? 0} Child
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">
                        ₹{b.total_price}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {b.start_date}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Pay at Counter
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            if (confirm(`Cancel reservation #${b.booking_id}?`)) {
                              deleteBooking(b.booking_id);
                            }
                          }}
                          className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                  {safeBookings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No user bookings recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED USERS */}
        {activeTab === 'users' && (
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900">Registered Users</h3>
              <span className="text-xs text-slate-500">
                Attendee user profiles created through registration
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 px-3 font-semibold">ID</th>
                    <th className="py-2.5 px-3 font-semibold">Name</th>
                    <th className="py-2.5 px-3 font-semibold">Email</th>
                    <th className="py-2.5 px-3 font-semibold">Registered At</th>
                    <th className="py-2.5 px-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeUsers.map((u) => (
                    <tr key={u.user_id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        #{u.user_id}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {u.full_name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {u.email}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {u.registered_at || 'Recently'}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            if (confirm(`Remove user ${u.full_name}?`)) {
                              deleteUser(u.user_id);
                            }
                          }}
                          className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {safeUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No registered users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900">Customer Reviews</h3>
              <span className="text-xs text-slate-500">
                Ratings and feedback submitted by attendees
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 px-3 font-semibold">Event</th>
                    <th className="py-2.5 px-3 font-semibold">Reviewer</th>
                    <th className="py-2.5 px-3 font-semibold">Rating</th>
                    <th className="py-2.5 px-3 font-semibold">Feedback</th>
                    <th className="py-2.5 px-3 font-semibold">Date</th>
                    <th className="py-2.5 px-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeReviews.map((r) => (
                    <tr key={r.review_id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {r.event_title}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {r.user_email}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-amber-600">
                        {r.rating || 5} / 5 Stars
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 max-w-xs">
                        {r.comment}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {r.created_at}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            if (confirm('Delete this review?')) {
                              deleteReview(r.review_id);
                            }
                          }}
                          className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {safeReviews.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No reviews submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PUBLISHED EVENTS */}
        {activeTab === 'events' && (
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Catalog Events ({safeEvents.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Active listings displayed on public search
                </span>
              </div>
              <button
                onClick={() => setActiveTab('create')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Event</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 px-3 font-semibold">Banner</th>
                    <th className="py-2.5 px-3 font-semibold">Title</th>
                    <th className="py-2.5 px-3 font-semibold">Category</th>
                    <th className="py-2.5 px-3 font-semibold">Date</th>
                    <th className="py-2.5 px-3 font-semibold">Location</th>
                    <th className="py-2.5 px-3 font-semibold">Price</th>
                    <th className="py-2.5 px-3 font-semibold">Duration</th>
                    <th className="py-2.5 px-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeEvents.map((e) => (
                    <tr key={e.event_id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <img
                          src={e.banner_url}
                          alt={e.title}
                          className="w-11 h-7 object-cover rounded"
                        />
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {e.title}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {e.category_name}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {e.start_date}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {e.location}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">
                        {e.price > 0 ? `₹${e.price}` : 'Free'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {e.duration}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            if (confirm(`Delete event "${e.title}" from database?`)) {
                              deleteEvent(e.event_id);
                            }
                          }}
                          className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {safeEvents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No events published yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 px-4 text-center text-slate-500 text-sm">
          Loading Admin Portal...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
