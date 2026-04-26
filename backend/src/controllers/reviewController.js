import { pool } from '../config/db.js';

export const createReview = async (req, res, next) => {
  try {
    const { provider_id, rating, comment } = req.body;
    const userId = req.user.id;

    // A user shouldn't review themselves
    if (provider_id === userId) {
      return res.status(400).json({ message: 'You cannot review yourself.' });
    }

    // Check if user already reviewed this provider
    const existingReview = await pool.query(
      'SELECT id FROM reviews WHERE user_id = $1 AND provider_id = $2',
      [userId, provider_id]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this provider.' });
    }

    // Insert the review
    const result = await pool.query(
      'INSERT INTO reviews (user_id, provider_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, provider_id, rating, comment]
    );

    res.status(201).json({
      message: 'Review submitted successfully',
      review: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
