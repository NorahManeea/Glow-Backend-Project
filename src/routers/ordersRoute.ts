import express from 'express'

import { validateOrder } from '../validation/validateOrder'
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrderHistory,
  returnOrder,
  updateOrderStatus,
} from '../controllers/orderController'
import { checkAuth, checkBlock, checkRole } from '../middlewares/verifyToken'

const router = express.Router()

// Get all orders route
router.get('/', checkAuth, checkRole('ADMIN'), getAllOrders)
// Get orders history route
router.get('/history', checkAuth, getOrderHistory)
// Get order by id route
router.get('/:orderId', getOrderById)

// Create new order route
router.post('/', checkAuth, checkBlock, validateOrder, createOrder)
// Return order route
router.post('/:orderId/return', checkAuth, returnOrder)

// Update order status route
router.put('/:orderId/status', checkAuth, checkRole('ADMIN'), updateOrderStatus)
// Update shipping information route
router.put('/:orderId/shippingInfo', validateOrder, updateOrderStatus)

// Delete order by id route
router.delete('/:orderId', checkAuth, checkRole('ADMIN'), deleteOrder)

export default router
