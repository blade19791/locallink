# LocalLink 🇷🇼

LocalLink is a premium, localized service finder platform built for **Rwanda**. It connects high-quality local professionals (Plumbers, Carpenters, IT Support, etc.) with clients across Kigali and its surrounding neighborhoods.

## 🚀 Features

- **Dynamic Search**: Find services based on category and location (Nyarugenge, Kicukiro, Gasabo, etc.).
- **Professional Dashboards**: Providers can manage their availability, professional profiles, and job requests.
- **Admin Center**: Full control over service categories, provider approvals, and platform integrity.
- **Booking System**: Seamless "Hire Now" flow with status tracking (Pending, Confirmed, Completed).
- **Localized Star Ratings**: Real user feedback with detailed reviews and interactive ratings.
- **Rwanda-Centric Data**: Pre-seeded with neighborhoods and professional services relevant to the Rwandan market.

## 🛠 Tech Stack

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS (Vanilla CSS Customizations)
- **State Management**: React Context API
- **Icons & UI**: Lucide-React, Framer Motion

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [PostgreSQL](https://www.postgresql.org/) (installed and running)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚙️ Installation & Setup

We have provided an automated setup script to make installation easy.

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd locallink
   ```

2. **Run the Setup Script**:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Database Configuration**:
   The script will create a `.env` file. Update the database credentials to match your local PostgreSQL setup:
   ```env
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=locallink
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_secret_key
   ```

4. **Initialize Database**:
   ```bash
   psql -d locallink -f database/schema.sql
   psql -d locallink -f database/mock.sql
   ```

## 🏃‍♂️ Running the Project

### Start the Backend
```bash
npm run dev
# Server will run on http://localhost:5000
```

### Start the Frontend
```bash
cd frontend
npm run dev
# App will run on http://localhost:5173
```

## 🌱 Seeding Data

To populate the system with Rwanda-localized professionals via the API:
```bash
chmod +x database/seed_curl.sh
./database/seed_curl.sh
```

## 🧪 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@locallink.rw | password123 |
| **Provider** | emmanuel@plumbing.rw | password123 |
| **Client** | jp.kabera@client.rw | password123 |

---

### License
MIT 
