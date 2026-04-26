import { pool } from '../src/config/db.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const seed = async () => {
  try {
    console.log('Clearing existing data...');
    await pool.query('DELETE FROM provider_services;');
    await pool.query('DELETE FROM reviews;');
    await pool.query('DELETE FROM provider_profiles;');
    await pool.query('DELETE FROM services;');
    await pool.query('DELETE FROM users;');

    console.log('Seeding Services...');
    const services = [
      { name: 'Mechanic', description: 'Car and vehicle repair' },
      { name: 'Plumber', description: 'Pipe and water system repair' },
      { name: 'Electrician', description: 'Electrical system installations and repair' },
      { name: 'Cleaner', description: 'Home and office cleaning' }
    ];

    const insertedServices = [];
    for (const s of services) {
      const res = await pool.query(
        'INSERT INTO services (name, description) VALUES ($1, $2) RETURNING *',
        [s.name, s.description]
      );
      insertedServices.push(res.rows[0]);
    }

    console.log('Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // 1 Admin
    await pool.query(
      'INSERT INTO users (name, email, password, role, is_approved) VALUES ($1, $2, $3, $4, $5)',
      ['Admin User', 'admin@example.com', defaultPassword, 'admin', true]
    );

    // 3 Clients
    const clients = [];
    for (let i = 1; i <= 3; i++) {
        const res = await pool.query(
            'INSERT INTO users (name, email, password, role, is_approved) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [`Client ${i}`, `client${i}@example.com`, defaultPassword, 'client', true]
        );
        clients.push(res.rows[0]);
    }

    // 3 Providers (2 approved, 1 pending)
    const providersData = [
        { name: 'Joe Mechanic', email: 'joe@mechanic.com', is_approved: true },
        { name: 'Paul Plumbing & Electric', email: 'paul@fixit.com', is_approved: true },
        { name: 'Cindy Cleaning', email: 'cindy@clean.com', is_approved: false },
    ];
    
    const providers = [];
    for (const p of providersData) {
        const res = await pool.query(
            'INSERT INTO users (name, email, password, role, is_approved) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [p.name, p.email, defaultPassword, 'provider', p.is_approved]
        );
        providers.push(res.rows[0]);
    }

    console.log('Seeding Provider Profiles...');
    const profiles = [
        { 
            user_id: providers[0].id, 
            phone: '555-0101', 
            location_text: 'Downtown Auto Center', 
            latitude: 37.7749, // SF
            longitude: -122.4194, 
            description: 'Fast and reliable mechanic.', 
            is_available: true 
        },
        { 
            user_id: providers[1].id, 
            phone: '555-0202', 
            location_text: 'Northside Homes', 
            latitude: 37.8044, // Oakland
            longitude: -122.2712, 
            description: 'Expert plumber and electrician.', 
            is_available: true 
        },
        { 
            user_id: providers[2].id, 
            phone: '555-0303', 
            location_text: 'South Bay Cleaners', 
            latitude: 37.3382, // San Jose
            longitude: -121.8863, 
            description: 'Spotless cleaning guaranteed.', 
            is_available: true 
        }
    ];

    for (const prof of profiles) {
        await pool.query(
            'INSERT INTO provider_profiles (user_id, phone, location_text, latitude, longitude, description, is_available) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [prof.user_id, prof.phone, prof.location_text, prof.latitude, prof.longitude, prof.description, prof.is_available]
        );
    }

    console.log('Seeding Provider Services...');
    // Mechanic -> Joe
    await pool.query('INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)', [providers[0].id, insertedServices.find(s => s.name === 'Mechanic').id]);
    
    // Plumber, Electrician -> Paul
    await pool.query('INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)', [providers[1].id, insertedServices.find(s => s.name === 'Plumber').id]);
    await pool.query('INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)', [providers[1].id, insertedServices.find(s => s.name === 'Electrician').id]);
    
    // Cleaner -> Cindy
    await pool.query('INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)', [providers[2].id, insertedServices.find(s => s.name === 'Cleaner').id]);

    console.log('Seeding Reviews...');
    // Client 1 reviews Joe
    await pool.query('INSERT INTO reviews (user_id, provider_id, rating, comment) VALUES ($1, $2, $3, $4)', [clients[0].id, providers[0].id, 5, 'Great mechanic, very fast!']);
    
    // Client 2 reviews Joe
    await pool.query('INSERT INTO reviews (user_id, provider_id, rating, comment) VALUES ($1, $2, $3, $4)', [clients[1].id, providers[0].id, 4, 'Good job, but a bit pricey.']);
    
    // Client 3 reviews Paul
    await pool.query('INSERT INTO reviews (user_id, provider_id, rating, comment) VALUES ($1, $2, $3, $4)', [clients[2].id, providers[1].id, 5, 'Fixed my sink in no time.']);

    console.log('Mock Data Seeded Successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
