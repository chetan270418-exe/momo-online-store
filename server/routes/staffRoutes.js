import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { staff } from '../middleware/staffMiddleware.js';
import Order from '../models/Order.js';

const router = express.Router();

router.use(protect, staff);

// Get active kitchen orders (Placed, Confirmed, Preparing)
router.get('/orders', async (req, res, next) => {
  try {
    const activeStatuses = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery'];
    const orders = await Order.find({ status: { $in: activeStatuses } })
      .populate('user', 'name phone')
      .sort('createdAt');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
});

// Staff can update order status to Preparing or Out for Delivery only
router.put('/orders/:id', async (req, res, next) => {
  try {
    const allowedStatuses = ['Preparing', 'Out for Delivery'];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      res.status(403);
      throw new Error('Staff can only set status to Preparing or Out for Delivery');
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
});

export default router;
