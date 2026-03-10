const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { username, password, role_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(
      'INSERT INTO users (username, password_hash, role_id) VALUES ($1, $2, $3) RETURNING id, username',
      [username, hashedPassword, role_id]
    );

    
    await db.query(
      'INSERT INTO audit_logs (user_id, action, target_id, new_value) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'CREATE_USER', newUser.rows[0].id, { username }]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Username already exists or invalid role" });
  }
};