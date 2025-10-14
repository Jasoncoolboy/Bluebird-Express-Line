US-- Create a new hash for password 'admin123' using bcrypt
-- Hash was generated using:
-- const bcrypt = require('bcryptjs');
-- const hash = bcrypt.hashSync('admin123', 10);
-- console.log(hash);

-- Remove existing admin user if exists
DELETE FROM users WHERE username = 'admin';

-- Insert admin user with hashed password (password: admin123)
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$xV8Mw/9xPqiyCzMfajnOKOxGWqT7r/BEwcLjOBcpgJ6QU4i0HmVlW', 'admin');

-- Verify the user was created
SELECT id, username, role FROM users WHERE username = 'admin';

-- Verify the password hash
SELECT password FROM users WHERE username = 'admin';d_DB;

-- Remove existing admin user if exists
DELETE FROM users WHERE username = 'admin';

-- Insert admin user with hashed password (password: admin123)
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$uR2JD0IsHkg3UQL1XE8pFewj8rJfGRU2zAlwJDo5IZXHzrde4y9Rq', 'admin');

-- Verify the user was created
SELECT id, username, role FROM users WHERE username = 'admin';