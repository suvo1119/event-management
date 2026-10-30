-- PostgreSQL Schema for Festivault Event & Festival Management Database System

CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    icon_key VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

-- Seed Categories
INSERT INTO categories (category_name, icon_key, description) VALUES
    ('Music', 'Music', 'Live concerts, EDM, acoustic nights & music fests'),
    ('Arts', 'Palette', 'Theatre, stand-up comedy, painting & exhibitions'),
    ('Food', 'Utensils', 'Street food carnivals, gourmet fests & culinary experiences'),
    ('Cultural', 'Globe', 'Traditional dance, heritage fairs & cultural celebrations'),
    ('Sports', 'Trophy', 'Marathons, fitness expos, tournaments & outdoor games')
ON CONFLICT (category_name) DO NOTHING;
