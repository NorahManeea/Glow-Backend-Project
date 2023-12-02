import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { OrderStatus } from './../enums/enums'
import {
  changeOrderStatus,
  createNewOrder,
  findAllOrders,
  findOrder,
  findOrderHistory,
  removeOrder,
} from '../services/orderService'
import ApiError from '../errors/ApiError'
import { Cart } from '../models/cartModel'
import { sendOrderConfirmationEmail } from '../helpers/emailHelpers'

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
    console.error(error)
    next(ApiError.badRequest('Something went wrong'))
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
    const order = await findOrder(req.params.id)

    res.status(200).json({ message: 'Single order returned successfully', payload: order })
  } catch (error) {
    console.error(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Create Order By ID
 * @route /api/orders
 * @method POST
 * @access public
 -----------------------------------------------*/
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await Cart.findOne({ user: req.decodedUser })
    if (!cart) {
      throw ApiError.notFound(`Cart not found with user ID: ${req.decodedUser}`)
    }

    const order = await createNewOrder(cart, req.body.shippingInfo)
    await sendOrderConfirmationEmail(req.decodedUser.email)

    res.status(201).json({ meassge: 'Order has been created successfuly', payload: order })
  } catch (error) {
    console.error(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Delete Order By ID
 * @route /api/orders/:orderId
 * @method DELETE
 * @access private (admin Only)
 -----------------------------------------------*/
export const deleteOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await removeOrder(req.params.id)

    res.status(200).json({ meassge: 'Order has been deleted Successfully', result: order })
  } catch (error) {
    console.error(error)
    next(ApiError.badRequest('Something went wrong'))
  }
})

/**-----------------------------------------------
 * @desc Update Order By ID
 * @route /api/orders/:orderId
 * @method PUT
 * @access private (admin Only)
 -----------------------------------------------*/
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedOrder = await changeOrderStatus(req.params.id, req.body.orderStatus)

    res.status(200).json({
      message: 'Category has been updated successfully',
      payload: updatedOrder,
    })
  } catch (error) {
    console.error(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Get Order History
 * @route /api/orders/history
 * @method GET
 * @access private (admin Only)
 -----------------------------------------------*/
export const getOrderHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderHistory = await findOrderHistory(req.decodedUser.userId)

    res.status(200).json({ message: 'Order History returned successfully', payload: orderHistory })
  } catch (error) {
    console.error(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc return order
 * @route /api/orders/:orderId/return
 * @method POST
 * @access private 
 -----------------------------------------------*/
export const returnOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Check order status
    const order = await findOrder(req.params.id)
    if (order.orderStatus !== OrderStatus.DELIVERED)
      return next(ApiError.badRequest('Order cannot be returned as it has not been delivered yet'))

    //Check return due date
    const returnDeadline = new Date(order.orderDate)
    returnDeadline.setDate(returnDeadline.getDate() + 7)
    const currentDate = new Date()
    if (currentDate > returnDeadline)
      return next(
        ApiError.badRequest('The order has exceeded the return time limit and cannot be returned')
      )

    const returnedOrder = await changeOrderStatus(req.params.id, OrderStatus.RETURNED)

    res
      .status(200)
      .json({ message: 'Order has been returned successfully', payload: returnedOrder })
  } catch (error) {
    console.error(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}
