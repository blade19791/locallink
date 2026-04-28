import { pool } from '../backend/src/config/db.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const seed = async () => {
  try {
    console.log('Clearing existing data...');
    await pool.query('DELETE FROM bookings;');
    await pool.query('DELETE FROM provider_services;');
    await pool.query('DELETE FROM reviews;');
    await pool.query('DELETE FROM provider_profiles;');
    await pool.query('DELETE FROM services;');
    await pool.query('DELETE FROM users;');

    console.log('Seeding Services...');
    const services = [
      { name: 'Plumber', description: 'Expert plumbing and pipe repair services.' },
      { name: 'Electrician', description: 'Professional electrical installations and repairs.' },
      { name: 'Mechanic', description: 'Certified vehicle maintenance and engine repair.' },
      { name: 'Carpenter', description: 'Custom woodworking, cabinetry, and home repairs.' },
      { name: 'Cleaning', description: 'Deep cleaning services for homes and offices.' },
      { name: 'Painting', description: 'Interior and exterior painting and finishing.' },
      { name: 'Gardening', description: 'Landscaping, lawn care, and garden maintenance.' },
      { name: 'HVAC', description: 'Heating, ventilation, and air conditioning services.' }
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
      ['Admin User', 'admin@locallink.com', defaultPassword, 'admin', true]
    );

    // 5 Clients
    const clients = [];
    for (let i = 1; i <= 5; i++) {
        const res = await pool.query(
            'INSERT INTO users (name, email, password, role, is_approved) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [`Client ${i}`, `client${i}@example.com`, defaultPassword, 'client', true]
        );
        clients.push(res.rows[0]);
    }

    // 25 Providers
    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'];
    
    const providers = [];
    for (let i = 0; i < 25; i++) {
        const name = `${firstNames[i]} ${lastNames[i]}`;
        const email = `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@pro.com`;
        const isApproved = Math.random() > 0.2; // 80% approved

        const res = await pool.query(
            'INSERT INTO users (name, email, password, role, is_approved) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, defaultPassword, 'provider', isApproved]
        );
        providers.push(res.rows[0]);
    }

    console.log('Seeding Provider Profiles...');
    // SF coordinates: 37.7749, -122.4194
    const sfLat = 37.7749;
    const sfLng = -122.4194;

    for (const p of providers) {
        const latOffset = (Math.random() - 0.5) * 0.1; // roughly +/- 5-10 miles
        const lngOffset = (Math.random() - 0.5) * 0.1;
        const phone = `555-01${Math.floor(10 + Math.random() * 90)}`;
        
        await pool.query(
            'INSERT INTO provider_profiles (user_id, phone, location_text, latitude, longitude, description, is_available) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [
                p.id, 
                phone, 
                'San Francisco Bay Area', 
                sfLat + latOffset, 
                sfLng + lngOffset, 
                `Professional and reliable service with years of experience. Contact ${p.name.split(' ')[0]} for quality work.`, 
                true
            ]
        );

        // Assign 1-3 random services to each provider
        const numServices = Math.floor(Math.random() * 3) + 1;
        const shuffledServices = [...insertedServices].sort(() => 0.5 - Math.random());
        const selectedServices = shuffledServices.slice(0, numServices);

        for (const s of selectedServices) {
            await pool.query('INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)', [p.id, s.id]);
        }
    }

    console.log('Seeding Reviews...');
    for (let i = 0; i < 40; i++) {
        const randomClient = clients[Math.floor(Math.random() * clients.length)];
        const randomProvider = providers[Math.floor(Math.random() * providers.length)];
        const rating = Math.floor(Math.random() * 3) + 3; // 3-5 star ratings
        
        const comments = [
            'Excellent service, highly recommend!',
            'Good work, arrived on time.',
            'Very professional and polite.',
            'Fixed the issue quickly.',
            'Great value for the price.',
            'Reliable and skilled.',
            'Would hire again for sure.'
        ];
        const comment = comments[Math.floor(Math.random() * comments.length)];

        await pool.query('INSERT INTO reviews (user_id, provider_id, rating, comment) VALUES ($1, $2, $3, $4)', 
            [randomClient.id, randomProvider.id, rating, comment]
        );
    }

    console.log('Mock Data Seeded Successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
