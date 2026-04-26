-- Rwanda LocalLink Seed Data
-- Target Region: Rwanda (Kigali and surroundings)

-- 1. Services
INSERT INTO services (id, name, description) VALUES 
('s1111111-1111-1111-1111-111111111111', 'House Cleaning', 'Professional clearing and sanitization for Kigali homes'),
('s2222222-2222-2222-2222-222222222222', 'Plumbing Kigali', 'Fixing leaks and pipes in Nyarugenge and beyond'),
('s3333333-3333-3333-3333-333333333333', 'IT Support', 'Hardware and software troubleshooting for Kicukiro businesses'),
('s4444444-4444-4444-4444-444444444444', 'Landscaping & Gardening', 'Beautiful gardens for Gasabo residential areas'),
('s5555555-5555-5555-5555-555555555555', 'Carpenter', 'Custom furniture and woodwork in Rwanda');

-- 2. Users (Providers)
-- Password is 'password123' -> $2b$10$FxvRqOTzubc0dujRcMb4N.H.WViPB.NNKPkQ/AtiLrvCUGm3L8vXC
INSERT INTO users (id, name, email, password, role, is_approved) VALUES 
('p1111111-1111-1111-1111-111111111111', 'Emmanuel Mutabazi', 'emmanuel@locallink.rw', '$2b$10$FxvRqOTzubc0dujRcMb4N.H.WViPB.NNKPkQ/AtiLrvCUGm3L8vXC', 'provider', true),
('p2222222-2222-2222-2222-222222222222', 'Divine Uwase', 'divine@cleaners.rw', '$2b$10$FxvRqOTzubc0dujRcMb4N.H.WViPB.NNKPkQ/AtiLrvCUGm3L8vXC', 'provider', true),
('p3333333-3333-3333-3333-333333333333', 'Kevin Ganza', 'kevin@ganza-it.rw', '$2b$10$FxvRqOTzubc0dujRcMb4N.H.WViPB.NNKPkQ/AtiLrvCUGm3L8vXC', 'provider', true),
('p4444444-4444-4444-4444-444444444444', 'Sandra Mugisha', 'sandra@gardens.rw', '$2b$10$FxvRqOTzubc0dujRcMb4N.H.WViPB.NNKPkQ/AtiLrvCUGm3L8vXC', 'provider', true);

-- 3. Provider Profiles
INSERT INTO provider_profiles (user_id, phone, location_text, latitude, longitude, description, is_available) VALUES 
('p1111111-1111-1111-1111-111111111111', '+250 788 123 456', 'Kigali, Nyarugenge', -1.9472, 30.0528, 'Expert plumber with 10 years of experience in Kigali.', true),
('p2222222-2222-2222-2222-222222222222', '+250 788 654 321', 'Kigali, Kicukiro', -1.9930, 30.1030, 'Reliable house cleaning focusing on eco-friendly products.', true),
('p3333333-3333-3333-3333-333333333333', '+250 783 000 111', 'Kigali, Gasabo', -1.9167, 30.0833, 'IT specialist for small businesses and home setups.', true),
('p4444444-4444-4444-4444-444444444444', '+250 785 222 333', 'Kigali, Kimironko', -1.9333, 30.1333, 'Enthusiastic gardener specializing in flowers and lawns.', true);

-- 4. Linking Providers to Services
INSERT INTO provider_services (provider_id, service_id) VALUES 
('p1111111-1111-1111-1111-111111111111', 's2222222-2222-2222-2222-222222222222'), -- Emmanuel -> Plumbing
('p1111111-1111-1111-1111-111111111111', 's5555555-5555-5555-5555-555555555555'), -- Emmanuel -> Carpenter
('p2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111'), -- Divine -> Cleaning
('p3333333-3333-3333-3333-333333333333', 's3333333-3333-3333-3333-333333333333'), -- Kevin -> IT
('p4444444-4444-4444-4444-444444444444', 's4444444-4444-4444-4444-444444444444'); -- Sandra -> Landscaping
