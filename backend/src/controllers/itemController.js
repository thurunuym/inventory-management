const db = require('../config/db');

exports.createItem = async (req, res) => {
  const { name, code, quantity, place_id, status, description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO items (name, code, quantity, place_id, status, description) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, code, quantity, place_id, status || 'In-Store', description]
    );
    
   
    await db.query(
      'INSERT INTO audit_logs (user_id, action, target_id, new_value) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'CREATE_ITEM', result.rows[0].id, JSON.stringify(result.rows[0])]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Item code must be unique" });
  }
};

exports.updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { change } = req.body; 

  const item = await db.query('SELECT quantity FROM items WHERE id = $1', [id]);
  const oldQty = item.rows[0].quantity;
  const newQty = oldQty + change;

  await db.query('UPDATE items SET quantity = $1 WHERE id = $2', [newQty, id]);

  
  await db.query(
    'INSERT INTO audit_logs (user_id, action, table_name, target_id, old_value, new_value) VALUES ($1, $2, $3, $4, $5, $6)',
    [req.user.id, 'QTY_CHANGE', 'items', id, { quantity: oldQty }, { quantity: newQty }]
  );

  res.json({ message: "Quantity updated", newQty });
};

exports.getAllItems = async (req, res) => {
  const result = await db.query(`
    SELECT i.*, p.name as place_name, c.name as cupboard_name 
    FROM items i 
    LEFT JOIN storage_places p ON i.place_id = p.id 
    LEFT JOIN cupboards c ON p.cupboard_id = c.id
  `);
  res.json(result.rows);
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const item = await client.query(
      "SELECT * FROM items WHERE id = $1",
      [id]
    );

    if (item.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Item not found" });
    }

    await client.query(
      "DELETE FROM items WHERE id = $1",
      [id]
    );

    await client.query(
      `INSERT INTO audit_logs 
      (user_id, action, table_name, target_id, old_value) 
      VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user.id,
        "DELETE_ITEM",
        "items",
        id,
        item.rows[0]
      ]
    );

    await client.query("COMMIT");

    res.json({ message: "Item deleted successfully" });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });

  } finally {
    client.release();
  }
};