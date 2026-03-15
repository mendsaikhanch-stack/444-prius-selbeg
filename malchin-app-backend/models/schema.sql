-- MALCHIN SUPER APP - Database Schema
-- PostgreSQL

-- Хэрэглэгчдийн хүснэгт
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'herder', -- herder, buyer, admin, vet, transporter
    aimag VARCHAR(100),
    sum VARCHAR(100),
    bag VARCHAR(100),
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Малын бүртгэл
CREATE TABLE IF NOT EXISTS livestock (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    animal_type VARCHAR(50) NOT NULL, -- sheep, goat, cattle, horse, camel
    total_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Малын үйл явдал (төл, хорогдол, борлуулалт г.м.)
CREATE TABLE IF NOT EXISTS livestock_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    animal_type VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- birth, death, sold, purchased, vaccinated
    quantity INTEGER NOT NULL,
    note TEXT,
    event_date DATE DEFAULT CURRENT_DATE
);

-- Зах зээлийн зар
CREATE TABLE IF NOT EXISTS market_listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) DEFAULT 'livestock', -- livestock, wool, cashmere, milk, hide
    title VARCHAR(200) NOT NULL,
    description TEXT,
    animal_type VARCHAR(50),
    quantity INTEGER,
    price INTEGER,
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'active', -- active, sold, expired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Тээврийн захиалга
CREATE TABLE IF NOT EXISTS transport_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    from_location VARCHAR(200),
    to_location VARCHAR(200),
    animal_type VARCHAR(50),
    quantity INTEGER,
    price_offer INTEGER,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Санхүүгийн бүртгэл
CREATE TABLE IF NOT EXISTS finance_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- income, expense
    category VARCHAR(100), -- cashmere, meat, milk, wool, feed, medicine, transport
    amount INTEGER NOT NULL,
    note TEXT,
    record_date DATE DEFAULT CURRENT_DATE
);

-- AI зөвлөгөөний лог
CREATE TABLE IF NOT EXISTS ai_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Аюулын мэдэгдэл
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    region VARCHAR(200),
    type VARCHAR(50) NOT NULL, -- wolf, dzud, theft, storm, disease, road_closed
    title VARCHAR(200) NOT NULL,
    description TEXT,
    severity VARCHAR(20) DEFAULT 'yellow', -- green, yellow, orange, red
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_livestock_user ON livestock(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user ON livestock_events(user_id);
CREATE INDEX IF NOT EXISTS idx_market_status ON market_listings(status);
CREATE INDEX IF NOT EXISTS idx_finance_user ON finance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_region ON alerts(region);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
