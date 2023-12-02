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
router.get('/:id', getOrderById)

// Create new order route
router.post('/', checkAuth, checkBlock, createOrder)
// Return order route
router.post('/:id/return', checkAuth, returnOrder)

// Update order status route
router.put('/:id', checkAuth, checkRole('ADMIN'), updateOrderStatus)

// Delete order by id route
router.delete('/:id', checkAuth, checkRole('ADMIN'), deleteOrder)

export default router
