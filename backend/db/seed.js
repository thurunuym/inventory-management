const fs = require("fs");
const path = require("path");
const db = require("../src/config/db");
const bcrypt = require("bcrypt");

async function seed() {
  try {

    const sql = fs.readFileSync(
      path.join(__dirname, "init.sql"),
      "utf8"
    );

    await db.query(sql);
    console.log("✅ Tables created");

    const hash = await bcrypt.hash("Thurunu@admin123", 10);

    await db.query(`
      INSERT INTO roles (name, permissions) VALUES 
      ('Admin', '["user.manage","item.create","item.update","item.delete","storage.manage","audit.view","item.view","borrow.manage"]'),
      ('Staff', '["item.update","borrow.manage","item.view","storage.view"]')
      ON CONFLICT (name) DO NOTHING
    `);

    const role = await db.query(
      `SELECT id FROM roles WHERE name = 'Admin'`
    );

    const adminRoleId = role.rows[0].id;

    await db.query(
      `
      INSERT INTO users (username, password_hash, role_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (username) DO NOTHING
      `,
      ["admin", hash, adminRoleId]
    );

    console.log("✅ Admin user seeded");

    process.exit();

  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();