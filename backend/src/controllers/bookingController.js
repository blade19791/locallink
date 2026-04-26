import { pool } from '../config/db.js';

export const createBooking = async (req, res, next) => {
  try {
    const { provider_id, service_id, scheduled_at, notes } = req.body;
    const client_id = req.user.id;

    // Check if provider exists
    const providerCheck = await pool.query('SELECT * FROM users WHERE id = $1 AND role = $2', [provider_id, 'provider']);
    if (providerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (client_id, provider_id, service_id, scheduled_at, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [client_id, provider_id, service_id, scheduled_at, notes, 'pending']
    );

    res.status(201).json({
      message: 'Booking request sent successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = '';
    if (role === 'provider') {
      query = `
        SELECT b.*, u.name as client_name, s.name as service_name 
        FROM bookings b
        JOIN users u ON b.client_id = u.id
        LEFT JOIN services s ON b.service_id = s.id
        WHERE b.provider_id = $1
        ORDER BY b.created_at DESC
      `;
    } else {
      query = `
        SELECT b.*, u.name as provider_name, s.name as service_name 
        FROM bookings b
        JOIN users u ON b.provider_id = u.id
        LEFT JOIN services s ON b.service_id = s.id
        WHERE b.client_id = $1
        ORDER BY b.created_at DESC
      `;
    }

    const result = await pool.query(query, [userId]);
    res.json({ bookings: result.rows });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Ensure only the provider (or both?) can update status
    // For simplicity, let's allow both but add checks if needed
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 AND (provider_id = $3 OR client_id = $3) RETURNING *',
      [status, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    res.json({ message: `Booking status updated to ${status}`, booking: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
