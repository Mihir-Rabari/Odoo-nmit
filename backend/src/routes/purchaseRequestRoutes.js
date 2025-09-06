const express = require('express');
const PurchaseRequest = require('../models/PurchaseRequest');
const Product = require('../models/Product');
const { protect } = require('../auth/authMiddleware');

const router = express.Router();

// Create a purchase request
router.post('/', protect, async (req, res) => {
  try {
    console.log('Creating purchase request:', req.body);
    const { productId, message, offeredPrice, buyerContact } = req.body;

    // Validate required fields
    if (!productId || !offeredPrice) {
      return res.status(400).json({ 
        message: 'Product ID and offered price are required' 
      });
    }

    // Get product details
    const product = await Product.findById(productId).populate('seller');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if buyer is not the seller
    if (product.seller._id.toString() === req.user.id) {
      return res.status(400).json({ 
        message: 'You cannot make a purchase request for your own product' 
      });
    }

    // Create purchase request
    const purchaseRequest = new PurchaseRequest({
      product: productId,
      buyer: req.user.id,
      seller: product.seller._id,
      message,
      offeredPrice,
      buyerContact: buyerContact || {
        email: req.user.email,
        phone: req.user.phone
      }
    });

    await purchaseRequest.save();
    await purchaseRequest.populate(['product', 'buyer', 'seller']);

    console.log('Purchase request created successfully:', purchaseRequest._id);
    res.status(201).json(purchaseRequest);
  } catch (error) {
    console.error('Error creating purchase request:', error);
    res.status(500).json({ 
      message: 'Failed to create purchase request', 
      error: error.message 
    });
  }
});

// Get purchase requests for seller (received requests)
router.get('/received', protect, async (req, res) => {
  try {
    console.log('Fetching received purchase requests for seller:', req.user.id);
    const requests = await PurchaseRequest.find({ seller: req.user.id })
      .populate('product', 'title price images')
      .populate('buyer', 'displayName email phone avatar')
      .sort({ createdAt: -1 });

    console.log(`Found ${requests.length} received purchase requests`);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching received purchase requests:', error);
    res.status(500).json({ 
      message: 'Failed to fetch purchase requests', 
      error: error.message 
    });
  }
});

// Get purchase requests made by buyer (sent requests)
router.get('/sent', protect, async (req, res) => {
  try {
    console.log('Fetching sent purchase requests for buyer:', req.user.id);
    const requests = await PurchaseRequest.find({ buyer: req.user.id })
      .populate('product', 'title price images')
      .populate('seller', 'displayName email phone avatar')
      .sort({ createdAt: -1 });

    console.log(`Found ${requests.length} sent purchase requests`);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching sent purchase requests:', error);
    res.status(500).json({ 
      message: 'Failed to fetch purchase requests', 
      error: error.message 
    });
  }
});

// Update purchase request status (accept/reject)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    console.log('Updating purchase request status:', req.params.id, req.body.status);
    const { status } = req.body;
    
    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be accepted, rejected, or completed' 
      });
    }

    const purchaseRequest = await PurchaseRequest.findById(req.params.id)
      .populate(['product', 'buyer', 'seller']);

    if (!purchaseRequest) {
      return res.status(404).json({ message: 'Purchase request not found' });
    }

    // Only seller can accept/reject, only buyer can mark as completed
    if (status === 'completed' && purchaseRequest.buyer._id.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Only the buyer can mark the request as completed' 
      });
    }

    if (['accepted', 'rejected'].includes(status) && purchaseRequest.seller._id.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Only the seller can accept or reject the request' 
      });
    }

    purchaseRequest.status = status;
    await purchaseRequest.save();

    console.log('Purchase request status updated successfully');
    res.json(purchaseRequest);
  } catch (error) {
    console.error('Error updating purchase request status:', error);
    res.status(500).json({ 
      message: 'Failed to update purchase request', 
      error: error.message 
    });
  }
});

// Get single purchase request details
router.get('/:id', protect, async (req, res) => {
  try {
    console.log('Fetching purchase request details:', req.params.id);
    const purchaseRequest = await PurchaseRequest.findById(req.params.id)
      .populate('product')
      .populate('buyer', 'displayName email phone avatar')
      .populate('seller', 'displayName email phone avatar');

    if (!purchaseRequest) {
      return res.status(404).json({ message: 'Purchase request not found' });
    }

    // Check if user is either buyer or seller
    const userId = req.user.id;
    if (purchaseRequest.buyer._id.toString() !== userId && 
        purchaseRequest.seller._id.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You do not have permission to view this purchase request' 
      });
    }

    console.log('Purchase request details fetched successfully');
    res.json(purchaseRequest);
  } catch (error) {
    console.error('Error fetching purchase request details:', error);
    res.status(500).json({ 
      message: 'Failed to fetch purchase request', 
      error: error.message 
    });
  }
});

module.exports = router;
