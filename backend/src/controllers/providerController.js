import { pool } from '../config/db.js';

export const updateProfile = async (req, res, next) => {
  try {
    const { phone, location_text, latitude, longitude, description, is_available } = req.body;
    const providerId = req.user.id;

    const result = await pool.query(
      `INSERT INTO provider_profiles (user_id, phone, location_text, latitude, longitude, description, is_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE SET 
         phone = EXCLUDED.phone,
         location_text = EXCLUDED.location_text,
         latitude = EXCLUDED.latitude,
         longitude = EXCLUDED.longitude,
         description = EXCLUDED.description,
         is_available = EXCLUDED.is_available
       RETURNING *`,
      [providerId, phone, location_text, latitude, longitude, description, is_available ?? true]
    );

    res.json({
      message: 'Profile updated successfully',
      profile: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateServices = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { service_ids } = req.body; // array of service uuids
    const providerId = req.user.id;

    await client.query('BEGIN');
    
    // First, clear existing services for this provider
    await client.query('DELETE FROM provider_services WHERE provider_id = $1', [providerId]);

    // Insert new services
    for (const serviceId of service_ids) {
      await client.query(
        'INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)',
        [providerId, serviceId]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Services updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const { is_available } = req.body;
    const providerId = req.user.id;

    const result = await pool.query(
      'UPDATE provider_profiles SET is_available = $1 WHERE user_id = $2 RETURNING id, is_available',
      [is_available, providerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Provider profile not found.' });
    }

    res.json({
      message: 'Availability toggled successfully',
      profile: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get basic details
    const providerResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.is_approved, p.phone, p.location_text, p.latitude, p.longitude, p.description, p.is_available
       FROM users u 
       LEFT JOIN provider_profiles p ON u.id = p.user_id 
       WHERE u.id = $1 AND u.role = 'provider'`,
      [id]
    );

    if (providerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found.' });
    }

    const provider = providerResult.rows[0];

    // Get services
    const servicesResult = await pool.query(
      `SELECT s.id, s.name 
       FROM services s 
       JOIN provider_services ps ON s.id = ps.service_id 
       WHERE ps.provider_id = $1`,
      [id]
    );

    // Get average rating
    const ratingResult = await pool.query(
      'SELECT ROUND(AVG(rating), 1) as avg_rating, COUNT(id) as total_reviews FROM reviews WHERE provider_id = $1',
      [id]
    );

    res.json({
      provider: {
        ...provider,
        services: servicesResult.rows,
        rating: {
          average: ratingResult.rows[0].avg_rating || 0,
          total: ratingResult.rows[0].total_reviews || 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name as reviewer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.provider_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM reviews WHERE provider_id = $1', [id]);
    const total = parseInt(countResult.rows[0].count, 10);

    res.json({
      reviews: result.rows,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    });
  } catch (error) {
    next(error);
  }
};
