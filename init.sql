CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  permissions JSONB
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password_hash TEXT,
  role_id INT REFERENCES roles(id)
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  target_id INT,
  new_value JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);