const db = require('../src/config/db');
const bcrypt = require('bcrypt');

async function seed() {
  const hash = await bcrypt.hash('Thurunu@admin123', 10);
  
  await db.query(`INSERT INTO roles (name, permissions) VALUES 
    ('Admin', '["user.manage", "item.create", "item.update", "item.delete", "storage.manage", "audit.view"]'),
    ('Staff', '["item.update", "borrow.manage"]')`);

  await db.query(`INSERT INTO users (username, password_hash, role_id) VALUES ($1, $2, $3)`, 
    ['admin', hash, 1]);

  console.log("admin Seeded");
  process.exit();
}
seed();