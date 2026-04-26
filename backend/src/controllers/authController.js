import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const register = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { name, email, password, role, phone, location_text, services } = req.body;

    // Check if user exists
    const userExists = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    await client.query('BEGIN');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine approval status
    // Providers need admin approval, clients are auto-approved
    const isApproved = role === 'provider' ? false : true;

    // Insert user
    const newUser = await client.query(
      'INSERT INTO users (name, email, password, role, is_approved) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, is_approved, created_at',
      [name, email, hashedPassword, role || 'client', isApproved]
    );

    const userId = newUser.rows[0].id;

    if (role === 'provider') {
      // Parse coordinates if possible
      let latitude = null;
      let longitude = null;
      if (location_text && location_text.includes(',')) {
        const parts = location_text.split(',');
        if (parts.length === 2) {
          const lat = parseFloat(parts[0].trim());
          const lng = parseFloat(parts[1].trim());
          if (!isNaN(lat) && !isNaN(lng)) {
            latitude = lat;
            longitude = lng;
          }
        }
      }

      // Create provider profile
      await client.query(
        'INSERT INTO provider_profiles (user_id, phone, location_text, latitude, longitude) VALUES ($1, $2, $3, $4, $5)',
        [userId, phone || null, location_text || null, latitude, longitude]
      );

      // Link services if provided
      if (services && Array.isArray(services)) {
        for (const serviceName of services) {
          // Find service by name (case-insensitive)
          const serviceRes = await client.query('SELECT id FROM services WHERE name ILIKE $1', [serviceName]);
          if (serviceRes.rows.length > 0) {
            await client.query(
              'INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)',
              [userId, serviceRes.rows[0].id]
            );
          }
        }
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0],
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, is_approved: user.is_approved },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_approved: user.is_approved
      }
    });
  } catch (error) {
    next(error);
  }
};
