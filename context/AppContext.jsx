'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_EVENTS,
  INITIAL_USERS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS
} from '@/lib/initial-data';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  EVENTS: 'event_mgmt_events',
  CATEGORIES: 'event_mgmt_categories',
  BOOKINGS: 'event_mgmt_bookings',
  USERS: 'event_mgmt_users',
  REVIEWS: 'event_mgmt_reviews',
  USER: 'loggedInUser',
  USER_EMAIL: 'userEmail',
  IS_ADMIN: 'isAdmin'
};

export function AppProvider({ children }) {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast notifier
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch initial data from API, falling back to localStorage or seeds
  const refreshData = useCallback(async () => {
    try {
      const [eventsRes, catRes, bookRes, revRes, usersRes] = await Promise.allSettled([
        fetch('/api/events').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/bookings').then(r => r.json()),
        fetch('/api/reviews').then(r => r.json()),
        fetch('/api/users').then(r => r.json())
      ]);

      if (eventsRes.status === 'fulfilled' && eventsRes.value?.success && Array.isArray(eventsRes.value.data)) {
        setEvents(eventsRes.value.data);
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(eventsRes.value.data));
      } else if (eventsRes.status === 'fulfilled' && eventsRes.value?.success === false) {
        setEvents([]);
      }

      if (catRes.status === 'fulfilled' && catRes.value?.success && Array.isArray(catRes.value.data)) {
        setCategories(catRes.value.data);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(catRes.value.data));
      }

      if (bookRes.status === 'fulfilled' && bookRes.value?.success && Array.isArray(bookRes.value.data)) {
        setBookings(bookRes.value.data);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookRes.value.data));
      } else if (bookRes.status === 'fulfilled' && bookRes.value?.success === false) {
        setBookings([]);
      }

      if (revRes.status === 'fulfilled' && revRes.value?.success && Array.isArray(revRes.value.data)) {
        setReviews(revRes.value.data);
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(revRes.value.data));
      } else {
        // Guaranteed fallback to clean array if route returned non-array
        setReviews([]);
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
      }

      if (usersRes.status === 'fulfilled' && usersRes.value?.success && Array.isArray(usersRes.value.data)) {
        setUsers(usersRes.value.data);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersRes.value.data));
      }
    } catch (err) {
      console.warn('API sync warning:', err);
      // Fallback to localStorage if API unavailable
      try {
        const localEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
        if (localEvents) {
          const parsed = JSON.parse(localEvents);
          if (Array.isArray(parsed)) setEvents(parsed);
        }
        const localBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
        if (localBookings) {
          const parsed = JSON.parse(localBookings);
          if (Array.isArray(parsed)) setBookings(parsed);
        }
        const localReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
        if (localReviews) {
          const parsed = JSON.parse(localReviews);
          if (Array.isArray(parsed)) setReviews(parsed);
          else setReviews([]);
        }
        const localUsers = localStorage.getItem(STORAGE_KEYS.USERS);
        if (localUsers) {
          const parsed = JSON.parse(localUsers);
          if (Array.isArray(parsed)) setUsers(parsed);
        }
      } catch (e) {
        console.error('LocalStorage load error', e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial client mount
  useEffect(() => {
    try {
      const storedAdmin = localStorage.getItem(STORAGE_KEYS.IS_ADMIN);
      if (storedAdmin === 'true') {
        setIsAdmin(true);
      }
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      // Sanitize stored collections to purge any corrupt non-array JSON objects
      const sanitizeStorage = (key, setter, defaultVal) => {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed)) {
              setter(parsed);
            } else {
              localStorage.removeItem(key);
              setter(defaultVal);
            }
          } catch {
            localStorage.removeItem(key);
            setter(defaultVal);
          }
        }
      };

      sanitizeStorage(STORAGE_KEYS.EVENTS, setEvents, INITIAL_EVENTS);
      sanitizeStorage(STORAGE_KEYS.CATEGORIES, setCategories, INITIAL_CATEGORIES);
      sanitizeStorage(STORAGE_KEYS.BOOKINGS, setBookings, INITIAL_BOOKINGS);
      sanitizeStorage(STORAGE_KEYS.USERS, setUsers, INITIAL_USERS);
      sanitizeStorage(STORAGE_KEYS.REVIEWS, setReviews, INITIAL_REVIEWS);
    } catch (e) {
      console.error('Auth restore error', e);
    }

    refreshData();
  }, [refreshData]);

  // Auth methods
  const login = async ({ role, email, password }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }

      if (role === 'admin') {
        setIsAdmin(true);
        setCurrentUser({ full_name: 'Administrator', role: 'admin' });
        localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
        showToast('Admin login successful! Welcome to the Management Portal.', 'success');
        return { success: true, role: 'admin' };
      } else {
        setIsAdmin(false);
        setCurrentUser(data.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, data.user.email);
        localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
        showToast(`Welcome back, ${data.user.full_name}!`, 'success');
        return { success: true, role: 'user', user: data.user };
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const register = async ({ full_name, email, password }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      showToast('Registration successful! Please login with your new account.', 'success');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    showToast('You have been logged out.', 'info');
  };

  // Event actions
  const createEvent = async (eventData) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create event');
      }
      setEvents(prev => [data.data, ...prev]);
      showToast('Event created and published successfully!', 'success');
      return data.data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete event');
      }
      setEvents(prev => prev.filter(e => Number(e.event_id) !== Number(eventId)));
      showToast('Event removed from catalog.', 'info');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Booking actions
  const createBooking = async (bookingData) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to book tickets');
      }
      setBookings(prev => [data.data, ...prev]);
      showToast(
        `Ticket booked! Total: ₹${data.data.total_price}. Please pay at the Event Counter on arrival.`,
        'success',
        6000
      );
      return data.data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to cancel booking');
      }
      setBookings(prev => prev.filter(b => Number(b.booking_id) !== Number(bookingId)));
      showToast('Booking cancelled successfully.', 'info');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Review actions
  const createReview = async (reviewData) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review');
      }
      setReviews(prev => [data.data, ...prev]);
      showToast('Thank you! Your review has been submitted.', 'success');
      return data.data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete review');
      }
      setReviews(prev => prev.filter(r => Number(r.review_id) !== Number(reviewId)));
      showToast('Review removed.', 'info');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // User actions
  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to remove user');
      }
      setUsers(prev => prev.filter(u => Number(u.user_id) !== Number(userId)));
      showToast('User account removed.', 'info');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const value = {
    events,
    categories,
    bookings,
    users,
    reviews,
    currentUser,
    isAdmin,
    loading,
    toasts,
    showToast,
    removeToast,
    login,
    register,
    logout,
    createEvent,
    deleteEvent,
    createBooking,
    deleteBooking,
    createReview,
    deleteReview,
    deleteUser,
    refreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
