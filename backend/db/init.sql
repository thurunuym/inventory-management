CREATE TYPE item_status AS ENUM ('In-Store', 'Borrowed', 'Damaged', 'Missing');

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id)
);

CREATE TABLE cupboards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE storage_places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cupboard_id INTEGER REFERENCES cupboards(id) ON DELETE CASCADE
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    serial_number VARCHAR(100),
    image_url TEXT,
    description TEXT,
    place_id INTEGER REFERENCES storage_places(id),
    status item_status DEFAULT 'In-Store'
);

CREATE TABLE borrowing_records (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id),
    borrower_name VARCHAR(255) NOT NULL,
    contact_details TEXT,
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_return_date TIMESTAMP,
    quantity_borrowed INTEGER NOT NULL,
    is_returned BOOLEAN DEFAULT FALSE
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100),
    table_name VARCHAR(50),
    target_id INTEGER,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);