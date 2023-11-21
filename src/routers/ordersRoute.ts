import express from 'express'
const router = express.Router()

import { addOrder, deleteOrder, getAllOrders, getOrderById, updateOrderStatus } from '../controllers/orderController'

router.get('/', getAllOrders)
router.get('/:id', getOrderById)

router.post('/', addOrder)

router.delete('/:id', deleteOrder)

router.put('/:id', updateOrderStatus)

export default router
