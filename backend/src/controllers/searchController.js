import { pool } from '../config/db.js';

export const searchProviders = async (req, res, next) => {
  try {
    const { service, lat, lng, is_available, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        u.id as user_id, u.name, p.phone, p.location_text, p.latitude, p.longitude, p.description, 
        COALESCE(p.is_available, true) as is_available,
        COALESCE(AVG(r.rating), 0) as avg_rating, count(DISTINCT r.id) as review_count
    `;

    // Add distance calculation if coords provided
    const hasLocation = lat && lng;
    if (hasLocation) {
        query += `,
        6371 * acos(
          cos(radians($1)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(p.latitude))
        ) AS distance
      `;
    }

    query += `
      FROM users u
      LEFT JOIN provider_profiles p ON u.id = p.user_id
      LEFT JOIN provider_services ps ON u.id = ps.provider_id
      LEFT JOIN services s ON s.id = ps.service_id
      LEFT JOIN reviews r ON u.id = r.provider_id
      WHERE u.is_approved = true AND u.role = 'provider'
    `;

    const queryParams = hasLocation ? [lat, lng] : [];
    let paramIndex = queryParams.length + 1;

    // Filter by Service
    if (service) {
      query += ` AND s.name ILIKE $${paramIndex}`;
      queryParams.push(`%${service}%`);
      paramIndex++;
    }

    // Filter by availability (only if specifically requested)
    if (is_available === 'true') {
      query += ` AND p.is_available = true`;
    }


    // Group By everything except aggregates
    query += ` GROUP BY u.id, p.id`;

    // Order
    let orderClause = ` ORDER BY p.is_available DESC`;
    if (hasLocation) {
      orderClause += `, distance ASC`;
    }
    orderClause += `, avg_rating DESC`;
    
    query += orderClause;

    // Count Total (Using a CTE or subquery approach)
    const countQuery = `SELECT COUNT(*) FROM (${query}) AS total_results`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count, 10);

    // Apply Pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    res.json({
      providers: result.rows,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      totalResults: total
    });
  } catch (error) {
    next(error);
  }
};
