import express from 'express'
const router = express.Router()

import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController'
import { checkAuth, checkRole } from '../middlewares/verifyToken'

// Get all orders route
router.get('/', checkAuth, getAllOrders)
// Get order by id route
router.get('/:orderId', getOrderById)

// Create new order route
router.post('/', checkAuth, createOrder)

// Delete order by id route
router.delete('/:orderId', checkAuth, checkRole('ADMIN'), deleteOrder)

// Update order status route
router.put('/:orderId', checkAuth, checkRole('ADMIN'), updateOrderStatus)

export default router
