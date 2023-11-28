import mongoose from 'mongoose'
import ApiError from '../errors/ApiError'
import { WishList } from '../models/wishListModel'

export const findWishList = async (userId: string) => {
  const wishlist = await WishList.findOne({ user: userId }).populate('products.product')

  if (!wishlist) {
    return ApiError.notFound('Wishlist not found')
  }
  return wishlist
}
export const removeFromWishList = async (productId: string, userId: string) => {
  const wishlist = await WishList.findOne({ user: userId })

  if (!wishlist) {
    return ApiError.notFound('Wishlist not found')
  }

  const updatedProducts = wishlist.products.filter((item) => item.product.toString() !== productId)

  if (updatedProducts.length === wishlist.products.length) {
    return ApiError.notFound('Product not found in wishlist')
  }

  wishlist.products = updatedProducts
  await wishlist.save()

  return wishlist
}
