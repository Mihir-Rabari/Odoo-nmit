const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

// Sample products data
const sampleProducts = [
  {
    name: "Vintage Danish Modern Dining Chair",
    description: "Beautiful vintage Danish modern dining chair in excellent condition. Perfect for adding mid-century style to your dining room.",
    price: 12000,
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    stock: 1
  },
  {
    name: "MacBook Pro 13\" 2019 - Excellent Condition",
    description: "MacBook Pro 13-inch from 2019 in excellent condition. Includes original charger and box. Perfect for students and professionals.",
    price: 75000,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    stock: 1
  },
  {
    name: "Designer Leather Handbag - Coach",
    description: "Authentic Coach leather handbag in great condition. Classic design that never goes out of style.",
    price: 15000,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    stock: 1
  },
  {
    name: "Rare Vinyl Collection - Classic Rock",
    description: "Collection of rare classic rock vinyl records. All in excellent condition with original sleeves.",
    price: 25000,
    category: "Music",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    stock: 1
  },
  {
    name: "Antique Oak Bookshelf",
    description: "Beautiful antique oak bookshelf with intricate carvings. Perfect for any home library or office.",
    price: 22000,
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    stock: 1
  },
  {
    name: "Professional Camera Kit",
    description: "Complete professional camera kit including lenses, tripod, and accessories. Perfect for photography enthusiasts.",
    price: 55000,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
    stock: 1
  }
];

// Sample user data
const bcrypt = require('bcryptjs');

const sampleUser = {
  email: 'seller@example.com',
  password: bcrypt.hashSync('password123', 12),
  displayName: 'Sample Seller',
  firstName: 'Sample',
  lastName: 'Seller',
  photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop',
  role: 'user',
  location: 'Mumbai, India',
  rating: 4.5,
  totalSales: 0,
  totalPurchases: 0
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create sample user
    const user = new User(sampleUser);
    await user.save();
    console.log('👤 Created sample user');

    // Create sample products
    const productsWithSeller = sampleProducts.map(product => ({
      ...product,
      seller: user._id
    }));

    await Product.insertMany(productsWithSeller);
    console.log(`📦 Created ${sampleProducts.length} sample products`);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: 1`);
    console.log(`   - Products: ${sampleProducts.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = { seedDatabase };
