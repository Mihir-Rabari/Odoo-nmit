const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../auth/authMiddleware');

const router = express.Router();

// Get all orders (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'email displayName').populate('products.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order by ID (Admin or owner)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email displayName').populate('products.product', 'name price');
    if (order) {
      if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create an order
router.post('/', protect, async (req, res) => {
  const { products, shippingAddress } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // Calculate total amount (simplified, in real app fetch product prices from DB)
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }
      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
      shippingAddress,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status (Admin only)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;