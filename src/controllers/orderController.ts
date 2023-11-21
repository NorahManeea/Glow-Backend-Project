import { Request, Response } from 'express'
import { Order } from '../models/orderModel'

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('products')
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('products')
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}

export const addOrder = async (req: Request, res: Response) => {
  try {
    const { user, orderDate, products, shippingInfo, orderStatus } = req.body
    const order = new Order({
      user,
      orderDate,
      products,
      shippingInfo,
      orderStatus,
    })
    await order.save()
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    await Order.findByIdAndDelete(req.params.id)
    res.status(200).json({
      message: 'Order has been deleted successfully',
      orderId: order._id,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    const { orderStatus } = req.body
    order.orderStatus = orderStatus
    await order.save()
    res.status(200).json({
      message: 'Order status updated successfully',
      updatedOrder: order,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
