import express from 'express'

import { validateOrder } from '../validation/validateOrder'
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrderHistory,
  getOrdersCount,
  getTotal,
  returnOrder,
  updateOrderStatus,
  updateShippingInfo,
} from '../controllers/orderController'
import { checkAuth, checkBlock, checkRole } from '../middlewares/verifyToken'

const router = express.Router()

router.get('/',checkAuth, checkRole('ADMIN'), getAllOrders)
router.post('/checkout', checkAuth, checkBlock, validateOrder, createOrder)
router.get('/history', checkAuth, getOrderHistory)
router.get('/revenue', getTotal)
router.get('/count', checkAuth, checkRole('ADMIN'), getOrdersCount)
router.get('/:orderId', getOrderById)
router.put('/:orderId/cancel', checkAuth, cancelOrder)
router.put('/:orderId/status', checkAuth, checkRole('ADMIN'), updateOrderStatus)
router.put('/:orderId/shippingInfo', validateOrder, updateShippingInfo)
router.put('/:orderId/return', checkAuth, returnOrder)
router.delete('/:orderId', checkAuth, checkRole('ADMIN'), deleteOrder)

export default router
