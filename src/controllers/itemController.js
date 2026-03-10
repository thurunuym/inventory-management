const db = require('../config/db');

exports.createItem = async (req, res) => {
  const { name, code, quantity, place_id, status, description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO items (name, code, quantity, place_id, status, description) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, code, quantity, place_id, status || 'In-Store', description]
    );
    
    // AUDIT LOG
    await db.query(
      'INSERT INTO audit_logs (user_id, action, target_id, new_value) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'CREATE_ITEM', result.rows[0].id, result.rows[0]]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Item code must be unique" });
  }
};

exports.updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { change } = req.body; // e.g., +5 or -3

  const item = await db.query('SELECT quantity FROM items WHERE id = $1', [id]);
  const oldQty = item.rows[0].quantity;
  const newQty = oldQty + change;

  await db.query('UPDATE items SET quantity = $1 WHERE id = $2', [newQty, id]);

  // AUDIT LOG: Previous -> New
  await db.query(
    'INSERT INTO audit_logs (user_id, action, table_name, target_id, old_value, new_value) VALUES ($1, $2, $3, $4, $5, $6)',
    [req.user.id, 'QTY_CHANGE', 'items', id, { quantity: oldQty }, { quantity: newQty }]
  );

  res.json({ message: "Quantity updated", newQty });
};