import express from 'express';
import {
  getStaff,
  createStaff,
  getUserById,
  deleteUser,
  getStats,
} from '../controllers/userController.js';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getStats);
router.route('/staff').get(getStaff).post(createStaff);
router.route('/staff/:id').get(getUserById).delete(deleteUser);
router.route('/orders').get(getAllOrders);
router.route('/orders/:id').put(updateOrderStatus).delete(deleteOrder);

export default router;
