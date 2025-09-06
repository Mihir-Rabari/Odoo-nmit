const fs = require('fs');
const path = require('path');

// Backend environment configuration
const backendEnv = `PORT=4000
MONGO_URI=mongodb://localhost:27017/ecofinds
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100`;

// Frontend environment configuration
const frontendEnv = `VITE_API_URL=http://localhost:4000/api/v1`;

// Create backend .env file
const backendEnvPath = path.join(__dirname, 'backend', '.env');
fs.writeFileSync(backendEnvPath, backendEnv);
console.log('✅ Created backend .env file');

// Update frontend .env file
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
fs.writeFileSync(frontendEnvPath, frontendEnv);
console.log('✅ Updated frontend .env file');

console.log('\n🚀 Environment setup complete!');
console.log('\nNext steps:');
console.log('1. Install backend dependencies: cd backend && npm install');
console.log('2. Install frontend dependencies: cd frontend && npm install');
console.log('3. Start MongoDB (make sure it\'s running on localhost:27017)');
console.log('4. Seed the database: cd backend && npm run seed');
console.log('5. Start backend: cd backend && npm start');
console.log('6. Start frontend: cd frontend && npm run dev');
