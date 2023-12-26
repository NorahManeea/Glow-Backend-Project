import { Order } from '../models/orderModel'
import { CartDocument } from '../types/types'
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
  shippingInfo: { country: string; city: string; address: string, province: string, postalCode: number }
) => {
  const { user, products } = userCart
  const order = new Order({
    user: user,
    orderDate: new Date(),
    products: products,
    shippingInfo: shippingInfo,
  })
  let totalPoints = 0;
  for (const product of products) {
    const productId = product.product.toString()
    const productDet = await Product.findById(productId);
    if (productDet && productDet.price >= 500 ) {
      totalPoints += 5;
    }else if(productDet && productDet.price < 500 && productDet.price >= 100){
      totalPoints += 3;
    } else {
      totalPoints += 1;
    }
    await updateItemsSold(productId)

  }
  await User.findByIdAndUpdate(user, { $inc: { points: totalPoints } });

  return order.save()
}

//** Service:- Update Number of Times a Product Sold */
export const updateItemsSold = async (productId: string) => {
  await Product.findByIdAndUpdate(productId, { $inc: { itemsSold: 1 } }, { new: true })
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

/**  // Check if the transition is valid
  if (!isValidStatusTransition(order.orderStatus, newStatus)) {
    throw ApiError.badRequest(`Invalid status transition from ${order.orderStatus} to ${newStatus}`);
  }

  // Update the order status
  order.orderStatus = newStatus;
  await order.save();

  return order;
};

// Function to check if the status transition is valid
const isValidStatusTransition = (currentStatus: OrderStatus, newStatus: OrderStatus): boolean => {
  // Define your logic for valid transitions here
  const validTransitions: { [key in OrderStatus]: OrderStatus[] } = {
    [OrderStatus.PENDING]: [OrderStatus.PROCESSING],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.RETURNED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.RETURNED]: [],
    [OrderStatus.CANCELED]: [],
  };

  return validTransitions[currentStatus].includes(newStatus); */

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
