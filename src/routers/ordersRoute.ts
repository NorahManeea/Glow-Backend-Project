import express from 'express'
import { validateOrder } from '../validation/validateOrder'

import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrderHistory,
  updateOrderStatus,
} from '../controllers/orderController'
import { checkAuth, checkBlock } from '../middlewares/verifyToken'

const router = express.Router()


// Get all orders route
router.get('/', getAllOrders)

// Get orders history
router.get('/history',checkAuth, getOrderHistory)

// Get order by id route
router.get('/:orderId', getOrderById)

// Create new order route
router.post('/', validateOrder,checkAuth,checkBlock, createOrder)

// Delete order by id route
router.delete('/:orderId', deleteOrder)

// Update order status route
router.put('/:orderId', updateOrderStatus)



export default router
