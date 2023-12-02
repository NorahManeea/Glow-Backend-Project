import { NextFunction, Request, Response } from 'express'

import { OrderStatus } from './../enums/enums'
import {
  changeOrderStatus,
  changeShippingInfo,
  createNewOrder,
  findAllOrders,
  findOrder,
  findOrderHistory,
  removeOrder,
} from '../services/orderService'
import ApiError from '../errors/ApiError'
import { Cart } from '../models/cartModel'
import { sendOrderConfirmationEmail } from '../helpers/emailHelpers'
import { checkStock, updateQuantityInStock } from '../services/productService'

/**-----------------------------------------------
 * @desc Get All Orders
 * @route /api/orders
 * @method GET
 * @access private (admin Only)
 -----------------------------------------------*/
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let pageNumber = Number(req.query.pageNumber)
    const limit = Number(req.query.limit)
    const user = req.query.user?.toString()
    const status = req.query.status?.toString()
    const { orders, totalPages, currentPage } = await findAllOrders(pageNumber, limit, user, status)
    res
      .status(200)
      .json({ message: 'All orders returned', payload: orders, totalPages, currentPage })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Get Order By ID
 * @route /api/orders/:orderId
 * @method GET
 * @access private (admin and user)
 -----------------------------------------------*/
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await findOrder(req.params.orderId)
    res.status(200).json({ message: 'Single order returned successfully', payload: order })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Create Order By ID
 * @route /api/orders
 * @method POST
 * @access private (only registered users)
 -----------------------------------------------*/
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await Cart.findOne({ user: req.decodedUser.userId })
    if (!cart) {
      throw ApiError.notFound(`Cart not found with user ID: ${req.decodedUser.userId}`)
    }
    //check stock for all prroducts in the cart
    cart.products.map(
      async (product) => await checkStock(product.product.toString(), product.quantity)
    )
    //create order
    const order = await createNewOrder(cart, req.body.shippingInfo)
    //update quantity in stock
    cart.products.map(
      async (product) => await updateQuantityInStock(product.product.toString(), product.quantity)
    )
    //send confirmation email
    await sendOrderConfirmationEmail(req.decodedUser.email)

    res.status(201).json({ meassge: 'Order has been created successfuly', payload: order })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Delete Order By ID
 * @route /api/orders/:orderId
 * @method DELETE
 * @access private (admin Only)
 -----------------------------------------------*/
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await removeOrder(req.params.orderId)
    res.status(200).json({ meassge: 'Order has been deleted Successfully', result: order })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Update Order By ID
 * @route /api/orders/:orderId
 * @method PUT
 * @access private (admin Only)
 -----------------------------------------------*/
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedOrder = await changeOrderStatus(req.params.orderId, req.body.orderStatus)
    res.status(200).json({
      message: 'Status has been updated successfully',
      payload: updatedOrder,
    })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Get Order History
 * @route /api/orders/history
 * @method GET
 * @access private (user himself Only)
 -----------------------------------------------*/
export const getOrderHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderHistory = await findOrderHistory(req.decodedUser.userId)
    if (orderHistory.length == 0) {
      return ApiError.notFound(`There are no order history`)
    }
    res.status(200).json({ message: 'Order History returned successfully', payload: orderHistory })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc return order
 * @route /api/orders/:orderId/return
 * @method PUT
 * @access private (user who has an order only)  
 -----------------------------------------------*/
export const returnOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Check order status
    const order = await findOrder(req.params.orderId)
    if (order.orderStatus !== OrderStatus.DELIVERED) {
      return next(ApiError.badRequest('Order cannot be returned as it has not been delivered yet'))
    }
    //Check return due date
    const returnDeadline = new Date(order.orderDate)
    returnDeadline.setDate(returnDeadline.getDate() + 7)
    const currentDate = new Date()
    if (currentDate > returnDeadline) {
      return next(
        ApiError.badRequest('The order has exceeded the return time limit and cannot be returned')
      )
    }
    const returnedOrder = await changeOrderStatus(req.params.orderId, OrderStatus.RETURNED)
    res
      .status(200)
      .json({ message: 'Order has been returned successfully', payload: returnedOrder })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc return order
 * @route /api/orders/:orderId/return
 * @method PUT
 * @access private (user who has an order only) 
 -----------------------------------------------*/
export const updateShippingInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Check order status
    const order = await findOrder(req.params.orderId)
    if (order.orderStatus !== OrderStatus.PENDING)
      return next(
        ApiError.badRequest(
          'Updating the shipping information is not possible at the moment as it is currently in the processing stage.'
        )
      )
    const updatedShippingInfo = await changeShippingInfo(req.params.orderId, req.body.shippingInfo)
    res.status(200).json({
      message: 'Shipping information has been updated successfully',
      payload: updatedShippingInfo,
    })
  } catch (error) {
    next(error)
  }
}
