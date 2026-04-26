import { pool } from '../config/db.js';

export const getServiceSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchQuery = `%${q}%`;
    const limit = 5;

    const result = await pool.query(
      'SELECT id, name FROM services WHERE name ILIKE $1 LIMIT $2',
      [searchQuery, limit]
    );

    res.json({
      suggestions: result.rows
    });
  } catch (error) {
    next(error);
  }
};

export const getAllServices = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY name ASC');
    res.json({
      services: result.rows
    });
  } catch (error) {
    next(error);
  }
};

