import { NextFunction, Request, Response } from "express";
import { WishList } from '../models/wishListModel';
import ApiError from "../errors/ApiError";

/**-----------------------------------------------
 * @desc Add to wishlist  
 * @route POST /api/wishlist/
 * @access Private 
 -----------------------------------------------*/
 export const addToWishList = async (req: Request, res: Response, next: NextFunction) => {
      try {
    const { productId } = req.body;
    const { userId } = req.decodedUser;

    const wishlist = await WishList.findOne({ user: userId });

    if (wishlist) {
      wishlist.products.push({ product: productId });
      await wishlist.save();
    } else {
      await WishList.create({ user: userId, products: [{ product: productId }] });
    }

    res.status(200).json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
};

/**-----------------------------------------------
 * @desc Delete from wishlist  
 * @route DELETE /api/wishlist/:id
 * @access Private 
 -----------------------------------------------*/
 export const deleteFromWishList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.decodedUser; 

    const wishlist = await WishList.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter((item) => item.product.toString() !== id);
    await wishlist.save();

    res.status(200).json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
};

/**-----------------------------------------------
 * @desc Get wishlist  
 * @route GET /api/wishlist/
 * @access Private 
 -----------------------------------------------*/
 export const getWishList = async (req: Request, res: Response, next: NextFunction) => {
      try {
    const { userId } = req.decodedUser; 

    const wishlist = await WishList.findOne({ user: userId }).populate('products.product');

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
};