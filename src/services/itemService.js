const db = require('../config/db');

const updateItemQuantity = async (userId, itemId, newQty) => {
    //old value for audit
    const oldItem = await db.query('SELECT quantity FROM items WHERE id = $1', [itemId]);
    const oldQty = oldItem.rows[0].quantity;

    
    await db.query('UPDATE items SET quantity = $1 WHERE id = $2', [newQty, itemId]);

    
    await db.query(
        'INSERT INTO audit_logs (user_id, action, target_id, old_value, new_value) VALUES ($1, $2, $3, $4, $5)',
        [userId, 'UPDATE_QTY', itemId, { quantity: oldQty }, { quantity: newQty }]
    );
};