import { Category } from '../models/categoryModel'
import createHttpError from 'http-errors'
import { CartDocument } from '../types/types'
import { Cart } from '../models/cartModel'
import { Product } from '../models/productModel'

export const findCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId }).populate('products.product')
  if (!cart) {
    const error = createHttpError(404, `Cart not found with userId: ${userId}`)
    throw error
  }
  return cart.products
}
export const updateCart = async (userId: string, cartItemId: string, quantity: number) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, 'products._id': cartItemId },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    )

    if (!updatedCart) {
      const error = new Error('Cart or product not found')
      throw error
    }

    const itemsCount = updatedCart.products.reduce((count, product) => count + product.quantity, 0)
    return { cart: updatedCart, itemsCount }
  } catch (error) {
    throw new Error('Failed to update cart item')
  }
}
