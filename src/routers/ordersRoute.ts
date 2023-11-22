import express from 'express'
const router = express.Router()

import { addOrder, deleteOrder, getAllOrders, getOrderById, updateOrderStatus } from '../controllers/orderController'

router.get('/', getAllOrders)
router.get('/:orderId', getOrderById)

router.post('/', addOrder)

router.delete('/:orderId', deleteOrder)

router.put('/:orderId', updateOrderStatus)

export default router
