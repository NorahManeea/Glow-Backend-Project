import { Order } from '../models/orderModel'
import { CartDocument } from '../types/types'
import { Product } from '../models/productModel'
import ApiError from '../errors/ApiError'

export const findAllOrders = async (pageNumber = 1, limit = 8, user = '', status = '') => {
  const orderCount = await Product.countDocuments()
  const totalPages = Math.ceil(orderCount / limit)

  if (pageNumber > totalPages) {
    pageNumber = totalPages
  }
  const skip = (pageNumber - 1) * limit

  const orders = await Order.find()
    .populate('products.product', 'productName productPrice')
    .skip(skip)
    .limit(limit)
    .find(
      user
        ? {
            $or: [
              { user: { $regex: user, $options: 'i' } },
              { orderStatus: { $regex: status, $options: 'i' } },
            ],
          }
        : {}
    )

  if (orders.length == 0) {
    throw ApiError.notFound('There are no orders')
  }

  return { orders, totalPages, currentPage: pageNumber }
}

export const findOrder = async (orderId: string) => {
  const order = await Order.findById(orderId).populate(
    'products.product',
    'productName productPrice'
  )
  if (!order) {
    throw ApiError.notFound(`Order not found with ID: ${orderId}`)
  }

  return order
}

export const removeOrder = async (orderId: string) => {
  const order = await Order.findByIdAndDelete(orderId)
  if (!order) {
    throw ApiError.notFound(`Order not found with ID: ${orderId}`)
  }

  return order
}

export const createNewOrder = async (
  userCart: CartDocument,
  shippingInfo: { country: string; city: string; address: string }
) => {
  const { user, products } = userCart
  const order = await Order.create({
    user: user,
    orderDate: new Date(),
    products: products,
    shippingInfo: shippingInfo,
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

export const findOrderHistory = async (userId: string) => {
  const orderHistory = await Order.find({ user: userId })
  if (!orderHistory) {
    throw ApiError.notFound(`There are no order history for user with ID: ${userId}`)
  }

  return orderHistory
}
