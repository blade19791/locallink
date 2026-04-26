#!/bin/bash

# LocalLink Rwanda - System Seeding Script (CURL Edition)
# This script populates the fresh database by calling the registration API.

API_URL="http://localhost:5000/api"

echo "🚀 Starting System Seed for Rwanda..."

# 1. Register Admin
echo "Creating Admin account..."
curl -X POST "$API_URL/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Super Admin",
       "email": "admin@locallink.rw",
       "password": "password123",
       "role": "admin"
     }'
echo -e "\n"

# 2. Register Clients
echo "Registering Clients..."
curl -X POST "$API_URL/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Jean-Paul Kabera",
       "email": "jp.kabera@client.rw",
       "password": "password123",
       "role": "client"
     }'
echo -e "\n"

# 3. Register Providers
echo "Registering Provider: Emmanuel Mutabazi (Plumbing)..."
curl -X POST "$API_URL/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Emmanuel Mutabazi",
       "email": "emmanuel@plumbing.rw",
       "password": "password123",
       "role": "provider",
       "phone": "+250 788 000 111",
       "location_text": "Kigali, Nyarugenge",
       "services": ["a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"]
     }'
echo -e "\n"

echo "Registering Provider: Divine Uwase (Cleaning)..."
curl -X POST "$API_URL/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Divine Uwase",
       "email": "divine@cleaners.rw",
       "password": "password123",
       "role": "provider",
       "phone": "+250 788 222 333",
       "location_text": "Kigali, Kicukiro",
       "services": ["a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14"]
     }'
echo -e "\n"

echo "Registering Provider: Kevin Ganza (IT Support)..."
curl -X POST "$API_URL/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Kevin Ganza",
       "email": "kevin@ganza-it.rw",
       "password": "password123",
       "role": "provider",
       "phone": "+250 783 555 444",
       "location_text": "Kigali, Gasabo",
       "services": ["a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15"]
     }'
echo -e "\n"

echo "✅ Seeding complete. Remember: Providers need Admin approval before appearing in search!"
