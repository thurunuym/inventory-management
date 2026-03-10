const db = require('../config/db');

exports.createCupboard = async (req, res) => {
  const { name } = req.body;
  const result = await db.query('INSERT INTO cupboards (name) VALUES ($1) RETURNING *', [name]);
  res.status(201).json(result.rows[0]);
};

exports.createPlace = async (req, res) => {
  const { name, cupboard_id } = req.body;
  const result = await db.query(
    'INSERT INTO storage_places (name, cupboard_id) VALUES ($1, $2) RETURNING *',
    [name, cupboard_id]
  );
  res.status(201).json(result.rows[0]);
};