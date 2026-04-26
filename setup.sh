#!/bin/bash

# LocalLink - Automated Setup Script

echo "🔧 Starting LocalLink installation..."

# 1. Install Backend Dependencies
echo "📦 Installing backend dependencies..."
npm install

# 2. Install Frontend Dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# 3. Environment Setup
if [ ! -f .env ]; then
    echo "📄 Creating .env from template..."
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "PORT=5000" > .env
        echo "DB_USER=postgres" >> .env
        echo "DB_PASSWORD=password" >> .env
        echo "DB_NAME=locallink" >> .env
        echo "DB_HOST=localhost" >> .env
        echo "DB_PORT=5432" >> .env
        echo "JWT_SECRET=local_link_secret_key_2024" >> .env
    fi
    echo "✅ .env created. PLEASE UPDATE IT WITH YOUR DB CREDENTIALS."
else
    echo "ℹ️ .env already exists. Skipping..."
fi

# 4. Check for PostgreSQL
if command -v psql >/dev/null 2>&1; then
    echo "🐘 PostgreSQL detected. Attempting to create database 'locallink'..."
    createdb locallink 2>/dev/null || echo "ℹ️ Database 'locallink' might already exist."
else
    echo "⚠️ PostgreSQL CLI not found. Please create the 'locallink' database manually."
fi

echo -e "\n🎉 Installation complete!"
echo "👉 1. Update .env with your DB credentials."
echo "👉 2. Run 'psql -d locallink -f database/schema.sql' to setup tables."
echo "👉 3. Run 'npm run dev' to start the backend."
echo "👉 4. Open a new terminal, 'cd frontend' and run 'npm run dev'."
