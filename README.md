# 🎪 Festivault — Event & Festival Management Database System

> A modern, full-stack event and festival discovery and management web application built with **Next.js 16 (App Router)**, **React 19 (JSX)**, **Tailwind CSS v4**, **PostgreSQL**, and **ImageKit CDN**.

[![Next.js 16](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19%20(JSX)-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![ImageKit](https://img.shields.io/badge/CDN-ImageKit%20Optimized-0052CC?style=flat-square)](https://imagekit.io)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](LICENSE)

---

## 📖 Table of Contents
1. [Overview](#-overview)
2. [Key Features & Capabilities](#-key-features--capabilities)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Project Directory Structure](#-project-directory-structure)
5. [Getting Started & Local Development](#-getting-started--local-development)
6. [Environment Variables (`.env`)](#-environment-variables-env)
7. [PostgreSQL Database Setup](#-postgresql-database-setup)
8. [ImageKit CDN & Auto-Compression](#-imagekit-cdn--auto-compression)
9. [Print Pass Feature (`@media print`)](#-print-pass-feature-media-print)
10. [Admin Portal & Authentication](#-admin-portal--authentication)
11. [REST API Documentation](#-rest-api-documentation)
12. [Production Deployment](#-production-deployment)

---

## 🌟 Overview

**Festivault** is an end-to-end event and festival management platform engineered for high performance, visual clarity, and rock-solid reliability:
- **No Dummy Data or Hardcoded Secrets**: Built for production readiness with clean databases and environment-configured credentials.
- **Modern Clean Light UI**: Built using pure **Tailwind CSS v4** tokens, flat cards, high contrast, clean slate neutrals, and zero artificial drop shadows.
- **PostgreSQL Database Backend**: Uses PostgreSQL connection pooling (`pg`) with automatic schema fallback.
- **Smart ImageKit CDN Integration**: Compresses uploaded festival banners client-side (1200×675 showcase format at 0.8 quality) and uploads to ImageKit under the `/event-managment` folder.
- **Pay-at-Counter Workflow**: Generates printable digital boarding passes for physical venue wristband collection.

---

## ✨ Key Features & Capabilities

### 👤 Attendee & Customer Experience
- **Interactive Event Discovery (`/events`)**:
  - Live search across festival titles, artist descriptions, and venues.
  - Category taxonomy filters: **Music**, **Arts**, **Food**, **Cultural**, and **Sports**.
  - Single-date picker filter.
  - Dynamic status tabs: **Upcoming Festivals** (active reservations) vs **Concluded Events** (feedback & ratings).
- **Dynamic Ticket Pricing**:
  - Independent count selectors for **Adult** and **Child** tickets.
  - Children automatically receive a **50% discount** calculated in real time.
- **Pay-at-Counter Guarantee**:
  - Reserves entry online without requiring dummy credit card input.
  - Generates clear reservation verification instructions for entry badge / wristband collection.
- **Printable Digital Boarding Pass (`/bookings`)**:
  - Dedicated voucher view with reservation ID, attendee details, ticket breakdown, and total due at the counter.
  - Click **"Print Pass"** or press `Ctrl + P` to produce a clean physical pass. Dedicated `@media print` CSS strips navbar, footers, and overlay controls for a perfect 1-page paper voucher.
- **Attendee Ticket Wallet (`/bookings`)**:
  - Look up all reserved tickets by attendee email.
  - View digital passes and cancel reservations anytime.
- **5-Star Rating & Review System**:
  - Submit ratings (1–5 stars) and detailed comments on concluded festivals.
- **User Profile Popover**:
  - Click your avatar in the navbar to see full name, email, and role badge.
  - Protected sign-out workflow with confirmation prompt ("Are you sure you want to sign out?").

### 🛡️ Management & Administration (`/admin`)
- **Passcode-Protected Gateway**:
  - Requires administrator passcode (`ADMIN_PASSWORD` in `.env`).
  - No public "Admin Portal" button in attendee navigation; access via `/admin`.
- **Live KPI Dashboard**:
  - Summary metrics: **Bookings**, **Total Expected Revenue (₹)**, **Registered Users**, **Customer Reviews**, and **Active Events**.
- **Event Creation Studio**:
  - Real-time 2-column layout: Form on the left, **Live Catalog Card Preview** on the right.
  - Banner image uploader with automated in-browser canvas compression and direct upload to ImageKit CDN (`/event-managment`).
- **Full Operational Tables**:
  - 🎟️ **Bookings Table**: Attendee email, ticket count breakdown, price, date, status, and cancellation button.
  - 👥 **Users Table**: User ID, full name, email, registration date, and account removal.
  - ⭐ **Reviews Table**: Event title, reviewer email, star rating, feedback comment, and delete action.
  - 🎪 **Active Events Table**: Banner thumbnail, event details, category badge, date, venue, price, duration, and catalog deletion.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16.4 (App Router) | Server-side rendering, API route handlers, and static optimization |
| **Language** | React 19 (JSX) | Pure `.jsx` components and pages, zero `.html` files |
| **Styling** | Tailwind CSS v4 | Clean light mode design system, typography, `@import "tailwindcss"` |
| **Icons** | Lucide React | High-performance vector iconography |
| **Database** | PostgreSQL (`pg`) | Schema with foreign key constraints, connection pool, and safe fallbacks |
| **Media / CDN** | ImageKit SDK | Automated image compression & showcase dimensions (1200×675) |
| **State Sync** | React Context (`AppContext.jsx`) | Real-time state hydration, defensive array verification, and toast notifications |

---

## 📁 Project Directory Structure

```
event-management/
├── app/
│   ├── layout.jsx               # Root layout with Navbar, Footer, and AppProvider
│   ├── globals.css              # Tailwind CSS v4 imports & @media print rules
│   ├── page.jsx                 # Landing page with hero, live metrics, and featured fests
│   ├── events/page.jsx          # Events catalog, filters, modals, and ticket lookup
│   ├── booking/[id]/page.jsx    # Dedicated booking page with ticket configuration
│   ├── bookings/page.jsx        # Attendee ticket wallet and printable pass viewer
│   ├── admin/page.jsx           # Admin dashboard with 5 management tabs and KPI metrics
│   ├── login/page.jsx           # Clean authentication portal (User / Admin)
│   ├── register/page.jsx        # Attendee registration form
│   ├── menu/page.jsx            # Responsive navigation hub & policies
│   ├── about/page.jsx           # System architecture and database documentation
│   └── api/                     # REST API Route Handlers
│       ├── auth/login/route.js
│       ├── auth/register/route.js
│       ├── bookings/route.js
│       ├── bookings/user/route.js
│       ├── categories/route.js
│       ├── events/route.js
│       ├── events/[id]/route.js
│       ├── reviews/route.js
│       ├── stats/route.js
│       ├── upload/route.js
│       └── users/route.js
├── components/
│   ├── Navbar.jsx               # Navigation bar with user avatar popover and sign-out modal
│   ├── Footer.jsx               # Clean footer with quick links and policy information
│   ├── EventCard.jsx            # Interactive festival card with booking modal trigger
│   ├── EventModal.jsx           # Comprehensive festival details modal dialog
│   ├── BookingModal.jsx         # Adult/Child ticket selection with 50% child discount
│   ├── DigitalTicket.jsx        # Printable boarding pass pass with simulated barcode
│   └── Toast.jsx                # Non-intrusive floating toast notifications
├── context/
│   └── AppContext.jsx           # Central state provider with defensive array validation
├── lib/
│   ├── image-compression.js     # Browser canvas image compression utility (1200x675)
│   ├── initial-data.js          # Categories taxonomy and empty data state
│   ├── postgres.js              # PostgreSQL connection pool with SSL support
│   └── store.js                 # Unified database adapter (PostgreSQL + memory fallback)
├── prisma/
│   ├── schema.prisma            # Prisma schema definition
│   └── schema.sql               # Production PostgreSQL table definitions
├── .env.example                 # Environment variables template
├── package.json                 # Project dependencies and npm scripts
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ recommended
- **npm**: v9+ (or pnpm / yarn)
- **PostgreSQL** (Optional but recommended for persistence; Neon, Supabase, or local PG)

### 2. Installation
Navigate into the `event-management` directory:
```bash
cd "event-management"
npm install
```

### 3. Environment Configuration
Copy the template to create your `.env` file:
```bash
cp .env.example .env
```
Fill in your PostgreSQL URL, ImageKit API keys, and Administrator passcode:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/event_festival_db?schema=public"
IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"
IMAGEKIT_FOLDER="/event-managment"
ADMIN_PASSWORD="your_admin_secret_passcode"
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🔐 Environment Variables (`.env`)

| Variable | Description | Example / Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname?sslmode=require` |
| `IMAGEKIT_PUBLIC_KEY` | Public key from ImageKit developer settings | `public_...` |
| `IMAGEKIT_PRIVATE_KEY` | Secret key from ImageKit developer settings | `private_...` |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | `https://ik.imagekit.io/your_id` |
| `IMAGEKIT_FOLDER` | Destination folder on ImageKit | `/event-managment` |
| `ADMIN_PASSWORD` | Passcode required to unlock `/admin` | `your_secret_admin_passcode` |

---

## 🗄️ PostgreSQL Database Setup

Run the following SQL commands in your PostgreSQL database (e.g., using `psql`, pgAdmin, Neon SQL Editor, or Supabase SQL Editor) to initialize the schema:

```sql
-- 1. Categories Taxonomy
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    icon_key VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Events & Festivals
CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    time_slot VARCHAR(50),
    location VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    banner_url TEXT,
    duration VARCHAR(100),
    age_limit VARCHAR(100),
    languages VARCHAR(255),
    interested_count INT DEFAULT 0,
    category_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- 3. User Accounts
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Ticket Bookings
CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_email VARCHAR(255) NOT NULL,
    event_id INT NOT NULL,
    adults INT NOT NULL DEFAULT 1,
    children INT NOT NULL DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'Pay at Counter',
    CONSTRAINT fk_bookings_event
        FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- 5. Customer Reviews
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_event
        FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- Initial Category Taxonomy Seeds
INSERT INTO categories (category_name, icon_key, description) VALUES
('Music', 'Music', 'Live concerts, EDM, acoustic nights & music fests'),
('Arts', 'Palette', 'Theatre, stand-up comedy, painting & exhibitions'),
('Food', 'Utensils', 'Street food carnivals, gourmet fests & culinary experiences'),
('Cultural', 'Globe', 'Traditional dance, heritage fairs & cultural celebrations'),
('Sports', 'Trophy', 'Marathons, fitness expos, tournaments & outdoor games')
ON CONFLICT (category_name) DO NOTHING;
```

---

## 🖼️ ImageKit CDN & Auto-Compression

When administrators create new festivals in the Admin Portal:
1. **Client-Side Canvas Compression**: `compressImageForShowcase()` intercepts the uploaded file, scales it to standard festival card dimensions (max 1200×675 px), and applies a 0.8 JPEG quality factor to ensure fast load times.
2. **CDN Upload (`/api/upload`)**: Uploads the compressed asset directly to your ImageKit media library under the `/event-managment` folder.
3. **Graceful Fallback**: If ImageKit API keys are not supplied in `.env`, the system automatically preserves the compressed DataURL locally so event publishing is never interrupted.

---

## 🖨️ Print Pass Feature (`@media print`)

Attendees can print their digital admission voucher directly from `/bookings`:
- Click **"Print Pass"** or use browser print shortcut (`Ctrl + P` / `Cmd + P`).
- Custom `@media print` rules automatically:
  - Isolate the `#printable-ticket` container.
  - Hide header navigation, footer, action buttons, close icons, and background shadows.
  - Fit the voucher cleanly on standard A4 or Letter paper for fast entry verification at the event counter.

---

## 🛡️ Admin Portal & Authentication

- **Direct URL Access**: Navigate to `/admin`.
- **Passcode Verification**: Enter your secret admin password (configured in `.env` as `ADMIN_PASSWORD`).
- **Profile Popover**: Logged-in users can click their avatar in the top navigation to view their details or securely sign out.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | List events with optional filters (`?keyword=`, `?category_id=`, `?date=`) |
| `POST` | `/api/events` | Create and publish a new event |
| `DELETE` | `/api/events/[id]` | Remove an event from the catalog |
| `GET` | `/api/categories` | Retrieve festival categories taxonomy |
| `GET` | `/api/bookings` | List all attendee ticket reservations |
| `POST` | `/api/bookings` | Book tickets with adult/child pricing and counter notice |
| `DELETE` | `/api/bookings?id={id}` | Cancel an existing booking reservation |
| `GET` | `/api/bookings/user?email={email}` | Retrieve bookings for a specific attendee |
| `GET` | `/api/users` | List registered user profiles (Admin) |
| `DELETE` | `/api/users?id={id}` | Delete a user profile (Admin) |
| `GET` | `/api/reviews` | List submitted event reviews |
| `POST` | `/api/reviews` | Submit a 1–5 star rating and comment |
| `DELETE` | `/api/reviews?id={id}` | Delete a review (Admin) |
| `GET` | `/api/stats` | Retrieve live KPI metric counters |
| `POST` | `/api/upload` | Upload compressed banner to ImageKit `/event-managment` |
| `POST` | `/api/auth/login` | Authenticate attendee or admin |
| `POST` | `/api/auth/register` | Register new attendee account |

---

## 🚢 Production Deployment

### Deploying to Vercel
1. Push the code to GitHub.
2. Import the repository into **Vercel**.
3. Set the **Root Directory** to `event-management`.
4. Configure the environment variables (`DATABASE_URL`, `IMAGEKIT_*`, `ADMIN_PASSWORD`).
5. Deploy! Vercel handles serverless function routing and Next.js static asset optimization automatically.

---

## 📄 License

This project is licensed under the MIT License.
