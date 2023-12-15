import { Order } from '../models/orderModel'
import { CartDocument } from '../types/types'
import { Product } from '../models/productModel'
import ApiError from '../errors/ApiError'
import { calculatePagination } from '../utils/paginationUtils'
import { findBySearchQuery } from '../utils/searchUtils'

//** Service:- Find All Orders */
export const findAllOrders = async (pageNumber = 1, limit = 8, user = '', status = '') => {
  const orderCount = await Product.countDocuments()
  const { currentPage, skip, totalPages } = calculatePagination(orderCount, pageNumber, limit)

  const orders = await Order.find()
    .populate('products.product', 'name price')
    .skip(skip)
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
  const order = await Order.findById(orderId).populate(
    'products.product',
    'name price'
  )
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
  shippingInfo: { country: string; city: string; address: string }
) => {
  const { user, products } = userCart
  const order = new Order({
    user: user,
    orderDate: new Date(),
    products: products,
    shippingInfo: shippingInfo,
  })
  for (const product of products) {
    const productId = product.product.toString()
    await updateItemsSold(productId)
  }
  return order.save()
}

//** Service:- Update Number of Times a Product Sold */
export const updateItemsSold = async (productId: string) => {
  await Product.findByIdAndUpdate(productId, { $inc: { itemsSold: 1 } }, { new: true })
}

//** Service:- Update Order Status */
export const changeOrderStatus = async (orderId: string, newStatus: string) => {
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
  const orderHistory = await Order.find({ user: userId })
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
