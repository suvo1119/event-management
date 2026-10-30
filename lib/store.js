import {
  INITIAL_CATEGORIES,
  INITIAL_EVENTS,
  INITIAL_USERS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS
} from './initial-data';
import { queryPostgres, getPostgresPool } from './postgres';

// Global in-memory fallback store
const globalStore = globalThis.__EVENT_DB_STORE__ || {
  categories: [...INITIAL_CATEGORIES],
  events: [...INITIAL_EVENTS],
  users: [...INITIAL_USERS],
  bookings: [...INITIAL_BOOKINGS],
  reviews: [...INITIAL_REVIEWS]
};

if (process.env.NODE_ENV !== 'production') {
  globalThis.__EVENT_DB_STORE__ = globalStore;
}

export const dbStore = {
  // Categories
  async getCategories() {
    try {
      if (getPostgresPool()) {
        const res = await queryPostgres(
          'SELECT category_id, category_name, icon_key as "iconKey", description FROM categories ORDER BY category_id ASC'
        );
        if (res.rows.length > 0) return res.rows;
      }
    } catch (e) {
      // fallback
    }
    return globalStore.categories;
  },

  // Events
  async getEvents({ keyword, category_id, date } = {}) {
    try {
      if (getPostgresPool()) {
        let query = `
          SELECT e.event_id, e.title, e.description, e.start_date, e.time_slot, e.location,
                 e.price, e.banner_url, e.duration, e.age_limit, e.languages, e.interested_count,
                 e.category_id, c.category_name
          FROM events e
          LEFT JOIN categories c ON e.category_id = c.category_id
          WHERE 1=1
        `;
        const params = [];
        let idx = 1;

        if (keyword) {
          query += ` AND (LOWER(e.title) LIKE $${idx} OR LOWER(e.description) LIKE $${idx} OR LOWER(e.location) LIKE $${idx})`;
          params.push(`%${keyword.toLowerCase().trim()}%`);
          idx++;
        }
        if (category_id) {
          query += ` AND e.category_id = $${idx}`;
          params.push(Number(category_id));
          idx++;
        }
        if (date) {
          query += ` AND e.start_date = $${idx}`;
          params.push(date);
          idx++;
        }
        query += ' ORDER BY e.start_date ASC, e.event_id DESC';

        const res = await queryPostgres(query, params);
        return res.rows.map(r => ({
          ...r,
          price: Number(r.price) || 0,
          start_date: typeof r.start_date === 'string' ? r.start_date : r.start_date?.toISOString().split('T')[0]
        }));
      }
    } catch (e) {
      // fallback
    }

    let list = [...globalStore.events];
    if (keyword) {
      const q = keyword.toLowerCase().trim();
      list = list.filter(
        e =>
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          (e.location && e.location.toLowerCase().includes(q))
      );
    }
    if (category_id) {
      list = list.filter(e => String(e.category_id) === String(category_id));
    }
    if (date) {
      list = list.filter(e => e.start_date && e.start_date.startsWith(date));
    }
    return list;
  },

  async getEventById(id) {
    try {
      if (getPostgresPool()) {
        const res = await queryPostgres(
          `SELECT e.event_id, e.title, e.description, e.start_date, e.time_slot, e.location,
                  e.price, e.banner_url, e.duration, e.age_limit, e.languages, e.interested_count,
                  e.category_id, c.category_name
           FROM events e
           LEFT JOIN categories c ON e.category_id = c.category_id
           WHERE e.event_id = $1`,
          [Number(id)]
        );
        if (res.rows[0]) {
          const r = res.rows[0];
          return {
            ...r,
            price: Number(r.price) || 0,
            start_date: typeof r.start_date === 'string' ? r.start_date : r.start_date?.toISOString().split('T')[0]
          };
        }
      }
    } catch (e) {
      // fallback
    }
    return globalStore.events.find(e => Number(e.event_id) === Number(id));
  },

  async createEvent(eventData) {
    const category = globalStore.categories.find(
      c => String(c.category_id) === String(eventData.category_id)
    );

    const newEvent = {
      event_id: Date.now(),
      title: eventData.title || 'Untitled Event',
      category_id: Number(eventData.category_id) || 1,
      category_name: category ? category.category_name : 'General',
      start_date: eventData.start_date || new Date().toISOString().split('T')[0],
      time_slot: eventData.time_slot || '07:00 PM',
      location: eventData.location || 'Main Auditorium',
      price: Number(eventData.price) || 0,
      duration: eventData.duration || '2 Hours',
      age_limit: eventData.age_limit || 'All Ages',
      languages: eventData.languages || 'English',
      description: eventData.description || '',
      banner_url: eventData.banner_url || '',
      interested_count: 0
    };

    try {
      if (getPostgresPool()) {
        const res = await queryPostgres(
          `INSERT INTO events (title, description, start_date, time_slot, location, price, banner_url, duration, age_limit, languages, category_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING event_id`,
          [
            newEvent.title,
            newEvent.description,
            newEvent.start_date,
            newEvent.time_slot,
            newEvent.location,
            newEvent.price,
            newEvent.banner_url,
            newEvent.duration,
            newEvent.age_limit,
            newEvent.languages,
            newEvent.category_id
          ]
        );
        if (res.rows[0]) {
          newEvent.event_id = res.rows[0].event_id;
        }
      }
    } catch (e) {
      // in-memory fallback
    }

    globalStore.events.unshift(newEvent);
    return newEvent;
  },

  async deleteEvent(eventId) {
    try {
      if (getPostgresPool()) {
        await queryPostgres('DELETE FROM events WHERE event_id = $1', [Number(eventId)]);
      }
    } catch (e) {
      // fallback
    }
    const prevLen = globalStore.events.length;
    globalStore.events = globalStore.events.filter(
      e => Number(e.event_id) !== Number(eventId)
    );
    return globalStore.events.length < prevLen;
  },

  // Bookings
  async getBookings() {
    try {
      if (getPostgresPool()) {
        const res = await queryPostgres(
          `SELECT b.booking_id, b.user_email, b.event_id, b.adults, b.children, b.total_price,
                  b.booking_date, b.payment_status, e.title, e.start_date, c.category_name
           FROM bookings b
           LEFT JOIN events e ON b.event_id = e.event_id
           LEFT JOIN categories c ON e.category_id = c.category_id
           ORDER BY b.booking_id DESC`
        );
        return res.rows.map(r => ({
          ...r,
          total_price: Number(r.total_price) || 0,
          start_date: typeof r.start_date === 'string' ? r.start_date : r.start_date?.toISOString().split('T')[0]
        }));
      }
    } catch (e) {
      // fallback
    }
    return globalStore.bookings;
  },

  async getBookingsByUser(email) {
    const norm = (email || '').trim().toLowerCase();
    if (!norm) return [];

    try {
      if (getPostgresPool()) {
        const res = await queryPostgres(
          `SELECT b.booking_id, b.user_email, b.event_id, b.adults, b.children, b.total_price,
                  b.booking_date, b.payment_status, e.title, e.start_date, c.category_name
           FROM bookings b
           LEFT JOIN events e ON b.event_id = e.event_id
           LEFT JOIN categories c ON e.category_id = c.category_id
           WHERE LOWER(b.user_email) = $1
           ORDER BY b.booking_id DESC`,
          [norm]
        );
        return res.rows.map(r => ({
          ...r,
          total_price: Number(r.total_price) || 0,
          start_date: typeof r.start_date === 'string' ? r.start_date : r.start_date?.toISOString().split('T')[0]
        }));
      }
    } catch (e) {
      // fallback
    }
    return globalStore.bookings.filter(b => b.user_email === norm);
  },

  async createBooking(bookingData) {
    const event = await this.getEventById(bookingData.eventId || bookingData.event_id);
    const adults = Number(bookingData.adults) || 1;
    const children = Number(bookingData.children) || 0;
    const basePrice = event ? Number(event.price) || 0 : 0;
    const computedTotal =
      bookingData.total_price != null
        ? Number(bookingData.total_price)
        : adults * basePrice + children * (basePrice * 0.5);

    const newBooking = {
      booking_id: Math.floor(1000 + Math.random() * 9000),
      event_id: event ? event.event_id : Number(bookingData.eventId),
      title: event ? event.title : bookingData.title || 'Event Booking',
      category_name: event ? event.category_name : 'General',
      user_email: (bookingData.email || bookingData.user_email || '').trim().toLowerCase(),
      adults,
      children,
      total_price: computedTotal,
      booking_date: new Date().toISOString(),
      start_date: event ? event.start_date : new Date().toISOString().split('T')[0],
      location: event ? event.location : 'Main Venue',
      time_slot: event ? event.time_slot : '07:00 PM',
      payment_status: 'Pay at Counter'
    };

    try {
      if (getPostgresPool()) {
        const res = await queryPostgres(
          `INSERT INTO bookings (event_id, user_email, adults, children, total_price, payment_status)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING booking_id`,
          [
            newBooking.event_id,
            newBooking.user_email,
            newBooking.adults,
            newBooking.children,
            newBooking.total_price,
            newBooking.payment_status
          ]
        );
        if (res.rows[0]) {
          newBooking.booking_id = res.rows[0].booking_id;
        }
      }
    } catch (e) {
      // fallback
    }

    globalStore.bookings.unshift(newBooking);
    return newBooking;
  },

  async deleteBooking(bookingId) {
    try {
      if (getPostgresPool()) {
        await queryPostgres('DELETE FROM bookings WHERE booking_id = $1', [Number(bookingId)]);
      }
    } catch (e) {
      // fallback
    }
    const prevLen = globalStore.bookings.length;
    globalStore.bookings = globalStore.bookings.filter(
      b => Number(b.booking_id) !== Number(bookingId)
    );
    return globalStore.bookings.length < prevLen;
  },

  // Users
  async getUsers() {
    try {
      if (getPostgresPool()) {
        const res = await queryPostgres(
          'SELECT user_id, full_name, email, created_at as registered_at FROM users ORDER BY user_id DESC'
        );
        return res.rows;
      }
    } catch (e) {
      // fallback
    }
    return globalStore.users;
  },

  async registerUser({ full_name, email, password }) {
    const norm = (email || '').trim().toLowerCase();
    if (!norm || !password) {
      throw new Error('Email and password are required');
    }

    try {
      if (getPostgresPool()) {
        const existing = await queryPostgres('SELECT user_id FROM users WHERE LOWER(email) = $1', [norm]);
        if (existing.rows.length > 0) {
          throw new Error('Email is already registered. Please login.');
        }

        const res = await queryPostgres(
          'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, full_name, email',
          [full_name || 'User', norm, password]
        );
        const newUser = res.rows[0];
        globalStore.users.push({ ...newUser, password });
        return newUser;
      }
    } catch (e) {
      if (e.message.includes('already registered')) throw e;
    }

    const existingMem = globalStore.users.find(u => u.email === norm);
    if (existingMem) {
      throw new Error('Email is already registered. Please login.');
    }

    const newUser = {
      user_id: Date.now(),
      full_name: full_name || 'User',
      email: norm,
      password: password,
      registered_at: new Date().toLocaleString('en-IN')
    };
    globalStore.users.push(newUser);
    return {
      user_id: newUser.user_id,
      full_name: newUser.full_name,
      email: newUser.email
    };
  },

  async authenticateUser(email, password) {
    const norm = (email || '').trim().toLowerCase();

    try {
      if (getPostgresPool()) {
        const res = await queryPostgres(
          'SELECT user_id, full_name, email, password_hash FROM users WHERE LOWER(email) = $1',
          [norm]
        );
        if (res.rows.length === 0) {
          throw new Error('User not registered. Please sign up first!');
        }
        const user = res.rows[0];
        if (user.password_hash !== password) {
          throw new Error('Invalid password. Please try again.');
        }
        return {
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email
        };
      }
    } catch (e) {
      if (e.message.includes('not registered') || e.message.includes('Invalid password')) {
        throw e;
      }
    }

    const user = globalStore.users.find(u => u.email === norm);
    if (!user) {
      throw new Error('User not registered. Please sign up first!');
    }
    if (user.password !== password) {
      throw new Error('Invalid password. Please try again.');
    }
    return {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email
    };
  },

  async deleteUser(userId) {
    try {
      if (getPostgresPool()) {
        await queryPostgres('DELETE FROM users WHERE user_id = $1', [Number(userId)]);
      }
    } catch (e) {
      // fallback
    }
    const prevLen = globalStore.users.length;
    globalStore.users = globalStore.users.filter(
      u => Number(u.user_id) !== Number(userId)
    );
    return globalStore.users.length < prevLen;
  },

  // Reviews
  async getReviews() {
    try {
      if (getPostgresPool()) {
        const res = await queryPostgres(
          `SELECT r.review_id, r.event_id, r.user_email, r.rating, r.comment, r.created_at, e.title as event_title
           FROM reviews r
           LEFT JOIN events e ON r.event_id = e.event_id
           ORDER BY r.review_id DESC`
        );
        return res.rows;
      }
    } catch (e) {
      // fallback
    }
    return globalStore.reviews;
  },

  async createReview({ event_id, user_email, rating, comment }) {
    const event = await this.getEventById(event_id);
    const newRev = {
      review_id: Date.now(),
      event_id: Number(event_id),
      event_title: event ? event.title : `Event #${event_id}`,
      user_email: (user_email || '').trim().toLowerCase(),
      rating: Number(rating) || 5,
      comment: comment || '',
      created_at: new Date().toLocaleString('en-IN')
    };

    try {
      if (getPostgresPool()) {
        const res = await queryPostgres(
          'INSERT INTO reviews (event_id, user_email, rating, comment) VALUES ($1, $2, $3, $4) RETURNING review_id',
          [newRev.event_id, newRev.user_email, newRev.rating, newRev.comment]
        );
        if (res.rows[0]) {
          newRev.review_id = res.rows[0].review_id;
        }
      }
    } catch (e) {
      // fallback
    }

    globalStore.reviews.unshift(newRev);
    return newRev;
  },

  async deleteReview(reviewId) {
    try {
      if (getPostgresPool()) {
        await queryPostgres('DELETE FROM reviews WHERE review_id = $1', [Number(reviewId)]);
      }
    } catch (e) {
      // fallback
    }
    const prevLen = globalStore.reviews.length;
    globalStore.reviews = globalStore.reviews.filter(
      r => Number(r.review_id) !== Number(reviewId)
    );
    return globalStore.reviews.length < prevLen;
  },

  // KPI Dashboard stats
  async getStats() {
    const events = await this.getEvents();
    const bookings = await this.getBookings();
    const users = await this.getUsers();
    const reviews = await this.getReviews();

    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (Number(b.total_price) || 0),
      0
    );

    return {
      totalBookings: bookings.length,
      totalRevenue: totalRevenue,
      totalUsers: users.length,
      totalReviews: reviews.length,
      totalEvents: events.length
    };
  }
};
