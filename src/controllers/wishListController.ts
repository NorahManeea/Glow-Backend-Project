import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import {
  addItemToWishList,
  createWishList,
  findWishList,
  removeFromWishList,
} from '../services/wishListService'

/**-----------------------------------------------
 * @desc Add to wishlist  
 * @route POST /api/wishlist/
 * @access Private 
 -----------------------------------------------*/
export const addToWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.decodedUser
    const { productId } = req.body
    let wishlist = await createWishList(userId)
    wishlist = await addItemToWishList(wishlist, productId)
    res
      .status(200)
      .json({ message: 'Product has been added successfully to wishlist', payload: wishlist })
  }
)

/**-----------------------------------------------
 * @desc Delete from wishlist  
 * @route DELETE /api/wishlist/:id
 * @access Private 
 -----------------------------------------------*/
export const deleteFromWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { userId } = req.decodedUser
    const wishlist = await removeFromWishList(id, userId)
    res
      .status(200)
      .json({ message: 'Product has been removed successfully from wishlist', payload: wishlist })
  }
)

/**-----------------------------------------------
 * @desc Get wishlist  
 * @route GET /api/wishlist/
 * @access Private 
 -----------------------------------------------*/
export const getWishList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.decodedUser
  const wishlist = await findWishList(userId)
  res.status(200).json({ message: 'WishList items returned successfully', payload: wishlist })
})
