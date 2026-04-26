import { pool } from '../config/db.js';

export const getPendingProviders = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.created_at, p.phone, p.location_text as location, 
       COALESCE(STRING_AGG(s.name, ', '), 'No services') as service
       FROM users u
       LEFT JOIN provider_profiles p ON u.id = p.user_id
       LEFT JOIN provider_services ps ON u.id = ps.provider_id
       LEFT JOIN services s ON s.id = ps.service_id
       WHERE u.role = 'provider' AND u.is_approved = false
       GROUP BY u.id, p.id
       ORDER BY u.created_at DESC`
    );

    res.json({
      count: result.rows.length,
      providers: result.rows
    });
  } catch (error) {
    next(error);
  }
};


export const approveProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE users SET is_approved = $1 WHERE id = $2 AND role = $3 RETURNING id, name, email, is_approved',
      [true, id, 'provider']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found or not a provider role.' });
    }

    res.json({
      message: 'Provider approved successfully',
      provider: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const rejectProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 AND role = $2 RETURNING id, name, email',
      [id, 'provider']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found or not a provider role.' });
    }

    res.json({
      message: 'Provider rejected and removed successfully',
      provider: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProviders = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.is_approved, u.created_at, p.phone, p.location_text as location, 
       COALESCE(STRING_AGG(s.name, ', '), 'No services') as service
       FROM users u
       LEFT JOIN provider_profiles p ON u.id = p.user_id
       LEFT JOIN provider_services ps ON u.id = ps.provider_id
       LEFT JOIN services s ON s.id = ps.service_id
       WHERE u.role = 'provider'
       GROUP BY u.id, p.id
       ORDER BY u.created_at DESC`
    );

    res.json({
      count: result.rows.length,
      providers: result.rows
    });
  } catch (error) {
    next(error);
  }
};

export const addService = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      'INSERT INTO services (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const result = await pool.query(
      'UPDATE services SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Service not found' });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};


