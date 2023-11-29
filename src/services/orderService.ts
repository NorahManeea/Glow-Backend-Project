
import { Order } from '../models/orderModel'
import { OrderDocument } from '../types/types'
import { Product } from '../models/productModel'
import ApiError from '../errors/ApiError'

export const findAllOrders = async () => {
  const orders = await Order.find().populate('products.product', 'productName productPrice')
  return orders
}

export const findOrder = async (orderId: string) => {
  const order = await Order.findById(orderId).populate('products.product', 'productName productPrice')
  if (!order) {
    throw ApiError.notFound(`Order not found with the ID: ${orderId}`)
  }
  return order
}

export const removeOrder = async (orderId: string) => {
  const order = await Order.findByIdAndDelete(orderId)
  if (!order) {
    throw ApiError.notFound(`Order not found with the ID: ${orderId}`)
  }
  return order
}

export const createNewOrder = async (newOrder: OrderDocument) => {
  const { user, orderDate, products, shippingInfo, orderStatus } = newOrder
  const order = await Order.create({
    user: user,
    orderDate: orderDate,
    products: products,
    shippingInfo: shippingInfo,
    orderStatus: orderStatus,
  })
  for (const product of products) {
    const productId = product.product.toString()
    await updateItemsSold(productId)
  }
  return order
}
export const updateItemsSold = async (productId: string) => {
  await Product.findByIdAndUpdate(productId, { $inc: { itemsSold: 1 } }, { new: true })
}

export const changeOrderStatus = async (orderId: string, newStatus: string) => {
  findOrder(orderId)
  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { orderStatus: newStatus } },
    { new: true })
  return order
}

export const findOrderHistory = async (userId: string) => {
  const orderHistory = await Order.find({ user: userId })
  return orderHistory
}
