import ApiError from '../errors/ApiError'
import { WishList } from '../models/wishListModel'

//** Service:- Find a wishlist */
export const findWishList = async (userId: string) => {
  const wishlist = await WishList.findOne({ user: userId }).populate('products.product')
  if (!wishlist) {
    throw ApiError.notFound('Wishlist not found')
  }
  return wishlist
}

//** Service:- Remove from wishlist */
export const removeFromWishList = async (productId: string, userId: string) => {
  const wishlist = await WishList.findOne({ user: userId })
  if (!wishlist) {
    throw ApiError.notFound('Wishlist not found')
  }
  const updatedProducts = wishlist.products.filter((item) => item.product.toString() !== productId)

  if (updatedProducts.length === wishlist.products.length) {
    throw ApiError.notFound('Product not found in wishlist')
  }

  wishlist.products = updatedProducts
  await wishlist.save()

  return wishlist
}
