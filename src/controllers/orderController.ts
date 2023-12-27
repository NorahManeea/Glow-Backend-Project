import { NextFunction, Request, Response } from 'express'

import { OrderStatus } from './../enums/enums'
import {
  changeOrderStatus,
  changeShippingInfo,
  createNewOrder,
  findAllOrders,
  findOrder,
  findOrderHistory,
  orderCount,
  removeOrder,
} from '../services/orderService'
import ApiError from '../errors/ApiError'
import { Cart } from '../models/cartModel'
import { sendOrderConfirmationEmail } from '../helpers/emailHelpers'
import { checkStock, updateQuantityInStock } from '../services/productService'
import Stripe from 'stripe'
import { paymentConfig } from '../config/payment.config'
import { calculateTotalPrice } from '../services/cartService'
import { Order } from '../models/orderModel'
import moment from 'moment'

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
    const cart = await Cart.findOne({ user: req.decodedUser.userId });

    if (!cart) {
      throw ApiError.notFound(`Cart not found with user ID: ${req.decodedUser.userId}`);
    }

    // Check stock for all products in the cart
    await Promise.all(
      cart.products.map(async (product) => {
        await checkStock(product.product.toString(), product.quantity);
      })
    );

    // Create order
    const stripe = new Stripe(paymentConfig.stripe, {
      apiVersion: '2023-10-16',
    });

    const { totalPrice, savedAmount, totalAfterDiscount } = await calculateTotalPrice(
      cart,
      req.body.discountCode
    );

    const charge = await stripe.charges.create({
      amount: totalAfterDiscount * 100,
      currency: 'sar',
      source: 'tok_mastercard',
      description: 'Test Charge',
    });
    const {order, totalPoints} = await createNewOrder(cart, req.body.shippingInfo);

    // Update quantity in stock
    await Promise.all(
      cart.products.map(async (product) => {
        await updateQuantityInStock(product.product.toString(), product.quantity);
      })
    );

    // Send confirmation email
    await sendOrderConfirmationEmail(req.decodedUser.email, req.decodedUser.firstName);

    res.status(201).json({
      message: 'Order has been created successfully',
      payload: { order, totalPrice, savedAmount, totalAfterDiscount, totalPoints },
      charge,
    });

    await Cart.deleteOne({ user: req.decodedUser.userId });
  } catch (error) {
    console.error('Error in createOrder:', error);

    next(error);
  }
};


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
    const orderId = req.params.orderId;
    const order = await findOrder(orderId);
    if (!order) {
      return next(ApiError.notFound('Order not found.'));
    }
    if (order.orderStatus !== OrderStatus.DELIVERED) {
      return next(ApiError.badRequest('Order must be delivered before it can be returned.'));
    }

    if (!canOrderBeReturned(order.deliveryDate)) {
      return next(ApiError.badRequest('Order cannot be returned after 7 days.'));
    }

    const returnedOrder = await changeOrderStatus(orderId, OrderStatus.RETURNED);

    res.status(200).json({
      message: 'Order has been returned successfully',
      payload: returnedOrder,
    });
  } catch (error) {
    next(error);
  }
};

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

/** -----------------------------------------------
 * @desc Get Order Count
 * @route /api/orders/count
 * @method GET
 * @access private
  -----------------------------------------------*/
export const getOrdersCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ordersCount = await orderCount()
    res.status(200).json({ meassge: 'Orders Count', payload: ordersCount })
  } catch (error) {
    next(error)
  }
}


/** -----------------------------------------------
 * @desc Cancel Order
 * @route /api/orders/:orderId/cancel
 * @method GET
 * @access private
  -----------------------------------------------*/
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.orderId

    if (!orderId) {
      return next(ApiError.badRequest('Order ID is required.'))
    }
    const order = await findOrder(orderId)

    if (!order) {
      return next(ApiError.notFound('Order not found.'))
    }

    if (order.orderStatus !== OrderStatus.PENDING) {
      return next(ApiError.badRequest('Order cannot be canceled as it is not in Pending status.'))
    }
    const canceledOrder = await changeOrderStatus(orderId, OrderStatus.CANCELED)
    res
      .status(200)
      .json({ message: 'Order has been canceled successfully', payload: canceledOrder })
  } catch (error) {
    next(error)
  }
}



/** -----------------------------------------------
 * @desc Get Order Totak
 * @route /api/orders/revenue
 * @method GET
 * @access private
  -----------------------------------------------*/
export const getTotal = async (req: Request, res: Response) => {
  const monthly = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: moment().startOf("year").toDate(),
          $lte: moment().endOf("year").toDate(),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        Total: { $sum: "$price" },
      },
    },
    {
      $addFields: {
        name: {
          $switch: {
            branches: [
              { case: { $eq: [ "$_id", 1 ] }, then: "Jan" },
              { case: { $eq: [ "$_id", 2 ] }, then: "Feb" },
              { case: { $eq: [ "$_id", 3 ] }, then: "Mar" },
              { case: { $eq: [ "$_id", 4 ] }, then: "Apr" },
              { case: { $eq: [ "$_id", 5 ] }, then: "May" },
              { case: { $eq: [ "$_id", 6 ] }, then: "Jun" },
              { case: { $eq: [ "$_id", 7 ] }, then: "Jul" },
              { case: { $eq: [ "$_id", 8 ] }, then: "Aug" },
              { case: { $eq: [ "$_id", 9 ] }, then: "Sep" },
              { case: { $eq: [ "$_id", 10 ] }, then: "Oct" },
              { case: { $eq: [ "$_id", 11 ] }, then: "Nov" },
              { case: { $eq: [ "$_id", 12 ] }, then: "Dec" },
            ],
            default: "Unknown",
          },
        },
        _id: "$$REMOVE", // Remove the original _id field
      },
    },
  ]);

  res.status(200).json(monthly);
}