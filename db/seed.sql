INSERT INTO roles (name, permissions) VALUES 
('Admin', '["user.manage", "item.create", "item.update", "item.delete", "storage.manage", "audit.view"]'),
('Staff', '["item.update", "borrow.manage"]');

INSERT INTO users (username, password_hash, role_id) 
VALUES ('admin_user', '$2b$10$YourHashedPasswordHere', 1);