import { pool } from '../config/db.js';

export const searchProviders = async (req, res, next) => {
  try {
    const { service, location, lat, lng, radius, is_available, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const queryParams = [];
    let paramIndex = 1;

    let distanceSelect = '';
    let distanceWhere = '';
    
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        distanceSelect = `,
          6371 * acos(
            LEAST(1, GREATEST(-1, 
              cos(radians($${paramIndex})) * cos(radians(p.latitude)) * 
              cos(radians(p.longitude) - radians($${paramIndex + 1})) + 
              sin(radians($${paramIndex})) * sin(radians(p.latitude))
            ))
          ) AS distance`;
        queryParams.push(latNum, lngNum);
        paramIndex += 2;

        if (radius) {
          const radiusNum = parseFloat(radius);
          if (!isNaN(radiusNum)) {
            distanceWhere = ` AND (
              6371 * acos(
                LEAST(1, GREATEST(-1, 
                  cos(radians($1)) * cos(radians(p.latitude)) * 
                  cos(radians(p.longitude) - radians($2)) + 
                  sin(radians($1)) * sin(radians(p.latitude))
                ))
              )
            ) <= $${paramIndex}`;
            queryParams.push(radiusNum);
            paramIndex++;
          }
        }
      }
    }

    let query = `
      SELECT 
        u.id as user_id, u.name, p.phone, p.location_text, p.latitude, p.longitude, p.description, 
        COALESCE(p.is_available, true) as is_available,
        COALESCE(AVG(r.rating), 0) as avg_rating, count(DISTINCT r.id) as review_count
        ${distanceSelect}
      FROM users u
      LEFT JOIN provider_profiles p ON u.id = p.user_id
      LEFT JOIN provider_services ps ON u.id = ps.provider_id
      LEFT JOIN services s ON s.id = ps.service_id
      LEFT JOIN reviews r ON u.id = r.provider_id
      WHERE u.is_approved = true AND u.role = 'provider'
    `;

    // Filter by Service
    if (service) {
      query += ` AND s.name ILIKE $${paramIndex}`;
      queryParams.push(`%${service}%`);
      paramIndex++;
    }

    // Filter by Location Text
    if (location) {
      query += ` AND p.location_text ILIKE $${paramIndex}`;
      queryParams.push(`%${location}%`);
      paramIndex++;
    }

    // Filter by availability
    if (is_available === 'true') {
      query += ` AND p.is_available = true`;
    }

    // Add distance filter if radius provided
    if (distanceWhere) {
      query += distanceWhere;
    }

    query += ` GROUP BY u.id, p.id`;

    // Order
    let orderClause = ` ORDER BY p.is_available DESC`;
    if (distanceSelect) {
      orderClause += `, distance ASC`;
    }
    orderClause += `, avg_rating DESC`;

    // Count Total
    const countQuery = `SELECT COUNT(*) FROM (${query}) AS total_results`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count, 10);

    // Apply Pagination
    query += orderClause + ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

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
