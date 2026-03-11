const db = require('../config/db');

exports.borrowItem = async (req, res) => {
  const { item_id, borrower_name, contact_details, qty, return_date } = req.body;

  try {
    const itemCheck = await db.query('SELECT quantity, name FROM items WHERE id = $1', [item_id]);
    console.log("itemCheck" , itemCheck)
    if (itemCheck.rows.length === 0) return res.status(404).json({ error: "Item not found" });

    const currentQty = itemCheck.rows[0].quantity;
    if (currentQty < qty) return res.status(400).json({ error: "Not enough stock available" });

    const newQty = currentQty - qty;
    await db.query('UPDATE items SET quantity = $1, status = $2 WHERE id = $3', 
      [newQty, 'Borrowed', item_id]);

    
    const borrowRecord = await db.query(
      `INSERT INTO borrowing_records 
      (item_id, borrower_name, contact_details, quantity_borrowed, expected_return_date) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [item_id, borrower_name, contact_details, qty, return_date]
    );

    
    await db.query(
      `INSERT INTO audit_logs (user_id, action, table_name, target_id, old_value, new_value) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [req.user.id, 'ITEM_BORROWED', 'items', item_id, 
       { quantity: currentQty }, { quantity: newQty, borrower: borrower_name }]
    );

    res.status(201).json({ message: "Borrow record created", record: borrowRecord.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

exports.returnItem = async (req, res) => {
    const { record_id } = req.params; 
  
    try {
      
      const record = await db.query('SELECT * FROM borrowing_records WHERE id = $1 AND is_returned = false', [record_id]);
      if (record.rows.length === 0) return res.status(404).json({ error: "Active borrow record not found" });
  
      const { item_id, quantity_borrowed } = record.rows[0];
  
      
      await db.query('UPDATE items SET quantity = quantity + $1, status = $2 WHERE id = $3', 
        [quantity_borrowed, 'In-Store', item_id]);
  
      
      await db.query('UPDATE borrowing_records SET is_returned = true WHERE id = $1', [record_id]);
  
      
      await db.query(
        'INSERT INTO audit_logs (user_id, action, target_id, old_value, new_value) VALUES ($1, $2, $3, $4, $5)',
        [req.user.id, 'ITEM_RETURNED', item_id, { status: 'Borrowed' }, { status: 'In-Store' }]
      );
  
      res.json({ message: "Item returned successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.getBorrowingLogs = async (req, res) => {
  const result = await db.query(`
    SELECT b.*, i.name as item_name 
    FROM borrowing_records b 
    JOIN items i ON b.item_id = i.id 
    ORDER BY b.borrow_date DESC
  `);
  res.json(result.rows);
};

  exports.getAuditLogs = async (req, res) => {
  const result = await db.query(`
    SELECT a.*, u.username 
    FROM audit_logs a 
    JOIN users u ON a.user_id = u.id 
    ORDER BY a.created_at DESC
  `);
  res.json(result.rows);
};