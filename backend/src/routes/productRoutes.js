const express = require('express');
const Product = require('../models/Product');
const { protect, authorize } = require('../auth/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all products');
    const products = await Product.find({}).populate('seller', 'displayName email');
    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching product by ID:', req.params.id);
    const product = await Product.findById(req.params.id).populate('seller', 'displayName email phone location rating');
    if (product) {
      console.log('Product found:', product.name);
      res.json(product);
    } else {
      console.log('Product not found');
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
});

// Upload image endpoint
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    console.log('Image upload request received');
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File uploaded successfully:', req.file.filename);
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

// Create a product (Users and Admin)
router.post('/', protect, authorize('user', 'admin'), async (req, res) => {
  const { name, description, price, category, imageUrl, stock } = req.body;
  try {
    console.log('Creating product:', { name, description, price, category, seller: req.user._id });
    const product = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
      seller: req.user._id, // Seller is the logged-in user
    });
    const createdProduct = await product.save();
    console.log('Product created successfully:', createdProduct._id);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a product (Owner or Admin only)
router.put('/:id', protect, async (req, res) => {
  const { name, description, price, category, imageUrl, stock } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Check if user is the seller or an admin
      if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this product' });
      }
      
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.imageUrl = imageUrl || product.imageUrl;
      product.stock = stock || product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product (Owner or Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Check if user is the seller or an admin
      if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this product' });
      }
      
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;