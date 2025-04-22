const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Get all orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = req.user.isAdmin 
      ? await Order.find().sort({ createdAt: -1 })
      : await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, total, address } = req.body;
    
    if (!items || !total || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = new Order({
      userId: req.user.userId,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      address,
      status: 'pending'
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (admin only)
router.put('/:orderId/status', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;