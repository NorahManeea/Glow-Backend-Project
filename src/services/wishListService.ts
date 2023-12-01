import ApiError from '../errors/ApiError'
import { WishList } from '../models/wishListModel'
import { ProductDocument, WishListDocument } from '../types/types'

//** Service:- Find a wishlist */
export const findWishList = async (userId: string) => {
  const wishlist = await WishList.findOne({ user: userId })
  if (!wishlist) {
    throw ApiError.notFound('Wishlist not found')
  }
  return wishlist
}

//** Service:- Create a wishlist */
export const createWishList = async (userId: string): Promise<WishListDocument> => {
  let wishlist = await findWishList(userId)
  if (!wishlist) {
    wishlist = await WishList.create({ user: userId, products: [] })
  }
  return wishlist
}
// ** Add Item to Wishlist */
export const addItemToWishList = async (wishlist: WishListDocument, product: ProductDocument) => {
  const existingWishListItem = wishlist.products.find(
    (p) => p.product.toString() === product._id.toString()
  )
  if (!existingWishListItem) {
    wishlist.products.push({ product: product._id })
  }
  await wishlist.save()
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
