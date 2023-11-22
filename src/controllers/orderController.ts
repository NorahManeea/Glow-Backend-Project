import { Request, Response } from 'express'
import { Order } from '../models/orderModel'

/**-----------------------------------------------
 * @desc Get All Orders
 * @route /api/orders
 * @method GET
 * @access private (admin Only)
 -----------------------------------------------*/
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

/**-----------------------------------------------
 * @desc Get Order By ID
 * @route /api/orders/:orderId
 * @method GET
 * @access private (admin and user)
 -----------------------------------------------*/
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId
    const orders = await Order.findById(orderId).populate('products')
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}

/**-----------------------------------------------
 * @desc Create Order By ID
 * @route /api/orders
 * @method POST
 * @access public
 -----------------------------------------------*/
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { user, orderDate, products, shippingInfo, orderStatus } = req.body
    const order = await Order.create({
      user: user,
      orderDate: orderDate,
      products: products,
      shippingInfo: shippingInfo,
      orderStatus: orderStatus,
    })
    await order.save()
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

/**-----------------------------------------------
 * @desc Delete Order By ID
 * @route /api/orders/:orderId
 * @method DELETE
 * @access private (admin Only)
 -----------------------------------------------*/
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    await Order.findByIdAndDelete(req.params.orderId)
    res.status(200).json({
      message: 'Order has been deleted successfully',
      orderId: order._id,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

/**-----------------------------------------------
 * @desc Update Product By ID
 * @route /api/orders/:orderId
 * @method PUT
 * @access private (admin Only)
 -----------------------------------------------*/
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const { orderStatus } = req.body
    const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, {$set: {orderStatus: orderStatus}}, {new:true})

    res.status(200).json({
      message: 'Order status updated successfully',
      updatedOrder: updatedOrder,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
