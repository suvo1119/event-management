# Festivault - Event & Festival Management Database System (Next.js)

A full-stack, modern event and festival management database system built with **Next.js 16 (App Router)** and **React 19**.

Migrated from the previous static HTML/Express setup to an integrated Next.js application with zero database setup required, rich dark-mode glassmorphic aesthetics, and live state synchronization.

---

## 🚀 Getting Started

From the `event-management` directory, run:

```bash
# Install dependencies (already installed during setup)
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To produce an optimized production build:

```bash
npm run build
npm start
```

---

## 🔑 Default Credentials

| Role | Username / Email | Password / Passcode | Notes |
|---|---|---|---|
| **Administrator** | N/A (Admin role selected) | `secret123` or `admin` | Unlocks full admin portal, event creation, user management, and booking analytics |
| **Normal User 1** | `rahul@example.com` | `user123` | Pre-seeded user with past bookings and reviews |
| **Normal User 2** | `priya@example.com` | `user123` | Pre-seeded user with comedy fest bookings |

---

## 🌟 Key Features & Improvements

### 1. Modern Glassmorphic Dark UI
- Designed with **Vanilla CSS tokens**, Google Fonts (*Outfit* and *Plus Jakarta Sans*), smooth neon gradient accents, and micro-interactions.
- Fully responsive across desktop, tablet, and mobile screens.

### 2. Events & Festival Discovery (`/events`)
- **Live Search & Multi-Filter**: Search by title, artist, or venue keyword, filter by categories (Music, Arts, Food, Cultural, Sports), or pick specific dates.
- **Dual Section View**:
  - **Upcoming Events**: Interactive ticket quantity counters directly on cards (Adults & Children with 50% child discounts calculated automatically).
  - **Past Events**: Concluded events with inline 1-5 star rating and customer review submission.
- **Event Details Modal**: Comprehensive event schedule, duration, age limits, languages, venue, and full description.

### 3. Ticket Booking & Payment Guarantee (`/booking/[id]`)
- **Instant Online Reservation**: No upfront payment friction.
- **Pay at Event Counter Guarantee**: Reserves the ticket online and generates instructions to pay at the venue entrance counter upon badge pickup.
- **Digital Boarding Pass Ticket**: Displays a printable entry voucher with simulated barcode, Booking ID, attendee email, ticket breakdown, and counter amount.

### 4. Attendee Ticket Wallet (`/bookings`)
- Lookup all reserved passes by account email.
- View and print digital entry passes.
- Instant reservation cancellation support.

### 5. Admin Management Portal (`/admin`)
- **Live KPI Stat Cards**: User Bookings, Total Reserved Revenue (₹), Registered Users, Customer Reviews, and Active Events.
- **5 Comprehensive Tabs**:
  - ➕ **Create New Event**: Title, banner photo upload (with instant file preview or URL input), duration, age limit, languages, category, date, time slot, venue location, price, and description.
  - 🎟️ **User Bookings**: Real-time table of all bookings saved by attendees with cancel actions.
  - 👥 **Registered Users**: Attendee account records with delete capability.
  - ⭐ **User Reviews**: Real-time customer ratings and feedback.
  - 🎪 **Published Events**: Manage and delete active event listings.

### 6. Authentication (`/login`, `/register`)
- Role toggle between Normal User and Admin.
- Email input automatically hides when Admin mode is selected.
- Quick demo credential autofill buttons for rapid testing.
- Password show/hide toggle and validation.

---

## 📁 Project Structure

```
event-management/
├── app/
│   ├── layout.js              # Global layout with Navbar, Footer, and AppProvider
│   ├── globals.css            # Dark glassmorphic design system and tokens
│   ├── page.js                # Landing page with hero, live metrics, and featured fests
│   ├── events/page.js         # Events catalog, filters, modals, and ticket lookup
│   ├── booking/[id]/page.js   # Dedicated booking page with ticket configuration
│   ├── bookings/page.js       # Attendee ticket wallet and printable pass viewer
│   ├── admin/page.js          # Admin dashboard with 5 management tabs and KPI metrics
│   ├── login/page.js          # Role-based login (User vs Admin)
│   ├── register/page.js       # New attendee account registration
│   ├── menu/page.js           # Fullscreen navigation drawer and policy modals
│   ├── about/page.js          # System architecture and database schema overview
│   └── api/
│       ├── events/            # GET events (filter), POST create event
│       ├── events/[id]/       # GET / DELETE single event
│       ├── categories/        # GET categories
│       ├── bookings/          # GET, POST, DELETE bookings
│       ├── bookings/user/     # GET user bookings by email
│       ├── auth/login/        # POST authenticate user or admin
│       ├── auth/register/     # POST register new attendee
│       ├── reviews/           # GET, POST, DELETE reviews
│       ├── users/             # GET, DELETE registered users
│       └── stats/             # GET live KPI dashboard stats
├── components/
│   ├── Navbar.js              # Responsive header with branding and session state
│   ├── Footer.js              # Dark footer with links and counter policy notice
│   ├── EventCard.js           # Interactive card with ticket counters and review form
│   ├── EventModal.js          # Detailed festival popup dialog
│   ├── BookingModal.js        # Ticket summary, breakdown, and reservation trigger
│   ├── DigitalTicket.js       # Digital boarding pass voucher with print support
│   └── Toast.js               # Floating toast notifications
├── context/
│   └── AppContext.js          # React Context syncing state across components and storage
└── lib/
    ├── initial-data.js        # Seed data matching original festival database
    └── store.js               # Server in-memory database store with full CRUD
```
