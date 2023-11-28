import { NextFunction, Request, Response } from 'express'
import { WishList } from '../models/wishListModel'
import ApiError from '../errors/ApiError'
import apiErrorHandler from '../middlewares/errorHandler'
import { findWishList, removeFromWishList } from '../services/wishListService'

/**-----------------------------------------------
 * @desc Add to wishlist  
 * @route POST /api/wishlist/
 * @access Private 
 -----------------------------------------------*/
export const addToWishList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.body
    const { userId } = req.decodedUser

    const wishlist = await WishList.findOne({ user: userId })

    if (wishlist) {
      wishlist.products.push({ product: productId })
      await wishlist.save()
    } else {
      await WishList.create({ user: userId, products: [{ product: productId }] })
    }

    res
      .status(200)
      .json({ message: 'Product has been added successfully to wishlist', payload: wishlist })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Delete from wishlist  
 * @route DELETE /api/wishlist/:id
 * @access Private 
 -----------------------------------------------*/
export const deleteFromWishList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { userId } = req.decodedUser

    const wishlist = await removeFromWishList(id, userId)
    res
      .status(200)
      .json({ message: 'Product has been removed successfully from wishlist', payload: wishlist })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Get wishlist  
 * @route GET /api/wishlist/
 * @access Private 
 -----------------------------------------------*/
export const getWishList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.decodedUser
    const wishlist = await findWishList(userId)
    res.status(200).json({ message: 'WishList items returned successfully', payload: wishlist })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}
