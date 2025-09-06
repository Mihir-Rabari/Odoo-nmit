const mongoose = require('mongoose');
require('dotenv').config();

const cleanupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/odoo-x-bit');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Drop the users collection to remove old schema and indexes
    try {
      await db.collection('users').drop();
      console.log('Dropped users collection');
    } catch (error) {
      console.log('Users collection does not exist or already dropped');
    }

    // Drop the products collection to ensure clean state
    try {
      await db.collection('products').drop();
      console.log('Dropped products collection');
    } catch (error) {
      console.log('Products collection does not exist or already dropped');
    }

    // Drop the orders collection to ensure clean state
    try {
      await db.collection('orders').drop();
      console.log('Dropped orders collection');
    } catch (error) {
      console.log('Orders collection does not exist or already dropped');
    }

    console.log('Database cleanup completed successfully');
    
  } catch (error) {
    console.error('Error during database cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

cleanupDatabase();
