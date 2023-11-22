import express from 'express'
const router = express.Router()

import { createOrder, deleteOrder, getAllOrders, getOrderById, updateOrderStatus } from '../controllers/orderController'

router.get('/', getAllOrders)
router.get('/:orderId', getOrderById)

router.post('/', createOrder)

router.delete('/:orderId', deleteOrder)

router.put('/:orderId', updateOrderStatus)

export default router
