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

exports.getStorage = async (req, res) => {
  const result = await db.query(`
    SELECT 
      c.id as cupboard_id,
      c.name as cupboard,
      p.id as place_id,
      p.name as place
    FROM cupboards c
    JOIN storage_places p ON c.id = p.cupboard_id
  `);

  res.json(result.rows);
};

exports.getStorageMap = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        c.id,
        c.name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'name', p.name
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS places
      FROM cupboards c
      LEFT JOIN storage_places p ON p.cupboard_id = c.id
      GROUP BY c.id, c.name
      ORDER BY c.name
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load storage map" });
  }
};