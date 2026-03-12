const db = require('../config/db');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.files.image;
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'inventory-management',
      resource_type: 'auto',
    });

    res.json({ image_url: uploadResult.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createItem = async (req, res) => {
  const { name, code, quantity, place_id, status, description, image_url } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO items (name, code, quantity, place_id, status, description, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, code, quantity, place_id, status || 'In-Store', description, image_url]
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


exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    const item = await db.query('SELECT status FROM items WHERE id = $1', [id]);
    if (item.rows.length === 0) return res.status(404).json({ error: "Item not found" });
    
    const oldStatus = item.rows[0].status;

    await db.query('UPDATE items SET status = $1 WHERE id = $2', [status, id]);

    
    await db.query(
      'INSERT INTO audit_logs (user_id, action, table_name, target_id, old_value, new_value) VALUES ($1, $2, $3, $4, $5, $6)',
      [req.user.id, 'STATUS_CHANGE', 'items', id, { status: oldStatus }, { status: status }]
    );

    res.json({ message: "Status updated successfully", status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};