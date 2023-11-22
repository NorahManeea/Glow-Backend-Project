import express from 'express'
const router = express.Router()

import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController'

// Get all orders route
router.get('/', getAllOrders)
// Get order by id route
router.get('/:orderId', getOrderById)

// Create new order route
router.post('/', createOrder)

// Delete order by id route
router.delete('/:orderId', deleteOrder)

// Update order status route
router.put('/:orderId', updateOrderStatus)

export default router
