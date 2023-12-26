import { NextFunction, Request, Response } from 'express'

import {
  addItemToWishList,
  createWishList,
  findWishList,
  removeFromWishList,
} from '../services/wishListService'
import { findProduct } from '../services/productService'

/**-----------------------------------------------
 * @desc Add to wishlist  
 * @route POST /api/wishlist/
 * @access Private 
 -----------------------------------------------*/
export const addToWishList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.decodedUser.userId
    const { productId } = req.body
    const product = await findProduct(productId)

    let wishlist = await createWishList(userId)
    wishlist = await addItemToWishList(wishlist, product)
    res
      .status(200)
      .json({ message: 'Product has been added successfully to wishlist',  wishlist })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Delete from wishlist  
 * @route DELETE /api/wishlist/:wishListId
 * @access Private 
 -----------------------------------------------*/
export const deleteFromWishList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { wishListId } = req.params
    const { userId } = req.decodedUser
    const wishlist = await removeFromWishList(wishListId, userId)
    res
      .status(200)
      .json({ message: 'Product has been removed successfully from wishlist', payload: wishlist })
  } catch (error) {
    next(error)
  }
}

/**-----------------------------------------------
 * @desc Get wishlist  
 * @route GET /api/wishlist/
 * @access Private 
 -----------------------------------------------*/
export const getWishList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.decodedUser.userId

    const wishlistItem = await findWishList(userId)
    res.status(200).json({ message: 'WishList items returned successfully', wishlistItems: wishlistItem })
  } catch (error) {
    next(error)
  }
}
