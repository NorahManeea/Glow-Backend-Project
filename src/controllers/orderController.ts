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
import { sendEmail } from '../utils/sendEmailUtils'
import { Cart } from '../models/cartModel'

/**-----------------------------------------------
 * @desc Get All Orders
 * @route /api/orders
 * @method GET
 * @access private (admin Only)
 -----------------------------------------------*/
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let pageNumber = Number(req.query.pageNumber)
    const limit = Number(req.query.limit)
    const user = req.query.user?.toString()
    const status = req.query.status?.toString()

    const { orders, totalPages, currentPage } = await findAllOrders(pageNumber, limit, user, status)

    res
      .status(200)
      .json({ message: 'All orders returned', payload: orders, totalPages, currentPage })
  }
)

/**-----------------------------------------------
 * @desc Get Order By ID
 * @route /api/orders/:orderId
 * @method GET
 * @access private (admin and user)
 -----------------------------------------------*/
export const getOrderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await findOrder(req.params.orderId)

    res.status(200).json({ message: 'Single order returned successfully', payload: order })
  }
)

/**-----------------------------------------------
 * @desc Create Order By ID
 * @route /api/orders
 * @method POST
 * @access public
 -----------------------------------------------*/
export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.decodedUser

  console.log(userId)
  const cart = await Cart.findOne({ user: userId })
  if (!cart) {
    throw ApiError.notFound(`Cart not found with user ID: ${userId}`)
  }

  const order = await createNewOrder(cart, req.body.shippingInfo)

  const subject = 'We have received your order'
  const htmlTemplate = `
        <div style="color: #333; text-align: center;">
          <h1 style="color: #1E1E1E;">Thanks for your purchase</h1>
         <p>We'll prepare your order for immediate dispatch and you will recive it shortly. We'll email you the shiping confirmation once your order is on its way.</p>
          <p style="font-size: 14px; color: #302B2E;">Black Tigers Team</p>
        </div>
      `
  await sendEmail(req.decodedUser.email, subject, htmlTemplate)

  res.status(201).json({ meassge: 'Order has been created successfuly', payload: order })
})

/**-----------------------------------------------
 * @desc Delete Order By ID
 * @route /api/orders/:orderId
 * @method DELETE
 * @access private (admin Only)
 -----------------------------------------------*/
export const deleteOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const order = await removeOrder(req.params.orderId)

  res.status(200).json({ meassge: 'Order has been deleted Successfully', result: order })
})

/**-----------------------------------------------
 * @desc Update Order By ID
 * @route /api/orders/:orderId
 * @method PUT
 * @access private (admin Only)
 -----------------------------------------------*/
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedOrder = await changeOrderStatus(req.params.orderId, req.body.orderStatus)

    res.status(200).json({
      message: 'Category has been updated successfully',
      payload: updatedOrder,
    })
  }
)

/**-----------------------------------------------
 * @desc Get Order History
 * @route /api/orders/history
 * @method GET
 * @access private (admin Only)
 -----------------------------------------------*/
export const getOrderHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.decodedUser
    console.log(userId)

    const orderHistory = await findOrderHistory(userId)

    res.status(200).json({ message: 'Order History returned successfully', payload: orderHistory })
  }
)

/**-----------------------------------------------
 * @desc return order
 * @route /api/orders/:orderId/return
 * @method POST
 * @access private 
 -----------------------------------------------*/
export const returnOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const order = await findOrder(req.params.orderId)
  if (order.orderStatus !== OrderStatus.DELIVERED) {
    return next(ApiError.badRequest('Order cannot be returned as it has not been delivered yet'))
  }

  const returnDeadline = new Date(order.orderDate)
  returnDeadline.setDate(returnDeadline.getDate() + 7)

  const currentDate = new Date()
  if (currentDate > returnDeadline) {
    return next(
      ApiError.badRequest('The order has exceeded the return time limit and cannot be returned')
    )
  }

  const returnedOrder = await changeOrderStatus(req.params.orderId, OrderStatus.RETURNED)

  res.status(200).json({ message: 'Order has been returned successfully', payload: returnedOrder })
})
