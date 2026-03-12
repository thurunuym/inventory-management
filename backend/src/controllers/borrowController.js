const db = require("../config/db");

exports.borrowItem = async (req, res) => {
  const { item_id, borrower_name, contact_details, qty, return_date } = req.body;

  if (!item_id || !borrower_name || !qty || qty <= 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // concurruncy
    const itemCheck = await client.query(
      "SELECT quantity, name FROM items WHERE id = $1 FOR UPDATE",
      [item_id]
    );

    if (itemCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Item not found" });
    }

    const currentQty = itemCheck.rows[0].quantity;

    if (currentQty < qty) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Not enough stock available" });
    }

    const newQty = currentQty - qty;
    const newStatus = newQty === 0 ? "Borrowed" : "In-Store";

    await client.query(
      "UPDATE items SET quantity = $1, status = $2 WHERE id = $3",
      [newQty, newStatus, item_id]
    );

    const borrowRecord = await client.query(
      `INSERT INTO borrowing_records
      (item_id, borrower_name, contact_details, quantity_borrowed, expected_return_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [item_id, borrower_name, contact_details, qty, return_date]
    );

    await client.query(
      `INSERT INTO audit_logs
      (user_id, action, table_name, target_id, old_value, new_value)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.user.id,
        "ITEM_BORROWED",
        "items",
        item_id,
        { quantity: currentQty },
        { quantity: newQty, borrower: borrower_name },
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Borrow record created",
      record: borrowRecord.rows[0],
    });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });

  } finally {
    client.release();
  }
};


exports.returnItem = async (req, res) => {
  const { record_id } = req.params;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const record = await client.query(
      "SELECT * FROM borrowing_records WHERE id = $1 AND is_returned = false FOR UPDATE",
      [record_id]
    );

    if (record.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Active borrow record not found" });
    }

    const { item_id, quantity_borrowed } = record.rows[0];

    const item = await client.query(
      "SELECT quantity FROM items WHERE id = $1 FOR UPDATE",
      [item_id]
    );

    if (item.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Item not found" });
    }

    const currentQty = item.rows[0].quantity;
    const newQty = currentQty + quantity_borrowed;

    const newStatus = newQty === 0 ? "Borrowed" : "In-Store";

    await client.query(
      "UPDATE items SET quantity = $1, status = $2 WHERE id = $3",
      [newQty, newStatus, item_id]
    );

    await client.query(
      "UPDATE borrowing_records SET is_returned = true WHERE id = $1",
      [record_id]
    );

    await client.query(
      `INSERT INTO audit_logs
      (user_id, action, table_name, target_id, old_value, new_value)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.user.id,
        "ITEM_RETURNED",
        "items",
        item_id,
        { quantity: currentQty },
        { quantity: newQty },
      ]
    );

    await client.query("COMMIT");

    res.json({ message: "Item returned successfully" });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });

  } finally {
    client.release();
  }
};


exports.getBorrowingLogs = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        b.*, 
        i.name AS item_name
      FROM borrowing_records b
      JOIN items i ON b.item_id = i.id
      ORDER BY b.borrow_date DESC
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAuditLogs = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        a.*, 
        u.username
      FROM audit_logs a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};