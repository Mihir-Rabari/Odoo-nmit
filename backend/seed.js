require('dotenv').config();
const mongoose = require('mongoose');
const { seedDatabase } = require('./src/utils/seedData');

const runSeeder = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecofinds');
    console.log('📡 Connected to MongoDB');

    // Run seeder
    await seedDatabase();

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
