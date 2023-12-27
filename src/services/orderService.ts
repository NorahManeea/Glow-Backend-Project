import { Order } from '../models/orderModel'
import { CartDocument, CreateNewOrderResponse } from '../types/types'
import { Product } from '../models/productModel'
import ApiError from '../errors/ApiError'
import { calculatePagination } from '../utils/paginationUtils'
import { findBySearchQuery } from '../utils/searchUtils'
import { OrderStatus } from '../enums/enums'
import { User } from '../models/userModel'

//** Service:- Find All Orders */
export const findAllOrders = async (pageNumber = 1, limit = 8, user = '', status = '') => {
  const orderCount = await Product.countDocuments()
  const { currentPage, perPage, totalPages } = calculatePagination(orderCount, pageNumber, limit)

  const orders = await Order.find()
    .populate('products.product', 'name price')
    .skip(perPage)
    .limit(limit)
    .find(findBySearchQuery(user, 'user'))
    .find(findBySearchQuery(status, 'orderStatus'))

  if (orders.length == 0) {
    throw ApiError.notFound('There are no orders')
  }

  return { orders, totalPages, currentPage }
}

//** Service:- Find Single Order */
export const findOrder = async (orderId: string) => {
  const order = await Order.findById(orderId).populate('products.product', 'name price')
  if (!order) {
    throw ApiError.notFound(`Order not found with ID: ${orderId}`)
  }

  return order
}

//** Service:- Remove an Order */
export const removeOrder = async (orderId: string) => {
  const order = await Order.findByIdAndDelete(orderId)
  if (!order) {
    throw ApiError.notFound(`Order not found with ID: ${orderId}`)
  }

  return order
}

//** Service:- Create an Order  */
export const createNewOrder = async (
  userCart: CartDocument,
  shippingInfo: {
    country: string
    city: string
    address: string
    province: string
    postalCode: number
  }
) => {
  const { user, products } = userCart
  const order = new Order({
    user: user,
    orderDate: new Date(),
    products: products,
    shippingInfo: shippingInfo,
  })
  let totalPoints = 0

  const updatePointsPromises = products.map(async (product) => {
    const productId = product.product.toString()
    const productQuantity = product.quantity

    const productDet = await Product.findById(productId)
    if (productDet) {
      if (productDet.price >= 500) {
        totalPoints += 5
      } else if (productDet.price < 500 && productDet.price >= 100) {
        totalPoints += 3
      } else {
        totalPoints += 1
      }

      await updateItemsSold(productId, productQuantity)
    }
  })

  await Promise.all(updatePointsPromises)
  order.save((error, savedOrder) => {
    if (error) {
      console.error('Error saving order:', error)
      throw error
    }
    console.log('Order saved successfully:', savedOrder)
  })

  await User.findByIdAndUpdate(user, { $inc: { points: totalPoints } })

  return { order, totalPoints }
}

//** Service:- Update Number of Times a Product Sold */
export const updateItemsSold = async (productId: string, quantity: number) => {
  await Product.findByIdAndUpdate(productId, { $inc: { itemsSold: 1 + quantity } }, { new: true })
}

//** Service:- Update Order Status */
export const changeOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { orderStatus: newStatus } },
    { new: true }
  )
  if (!order) {
    throw ApiError.notFound(`Order not found with ID: ${orderId}`)
  }

  return order
}

//** Service:- Find a User's Order History */
export const findOrderHistory = async (userId: string) => {
  const orderHistory = await Order.find({ user: userId }).populate('products.product')
  if (!orderHistory) {
    throw ApiError.notFound(`Order not found with ID: ${userId}`)
  }
  return orderHistory
}

//** Service:- Update Shipping Information */
export const changeShippingInfo = async (orderId: string, newShippingInfo: string) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { shippingInfo: newShippingInfo } },
    { new: true }
  )
  if (!order) {
    throw ApiError.notFound(`Order not found with ID: ${orderId}`)
  }

  return order
}

//** Service:- Count Orders */
export const orderCount = async () => {
  let ordersCount = await Order.countDocuments()
  return ordersCount
}
