// MongoDB initialization script for Docker
db = db.getSiblingDB('marketplace');

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('purchaserequests');
db.createCollection('orders');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.products.createIndex({ "seller": 1 });
db.products.createIndex({ "category": 1 });
db.purchaserequests.createIndex({ "buyer": 1 });
db.purchaserequests.createIndex({ "seller": 1 });
db.purchaserequests.createIndex({ "product": 1 });
db.orders.createIndex({ "buyer": 1 });

print('MongoDB initialized successfully for marketplace application');
