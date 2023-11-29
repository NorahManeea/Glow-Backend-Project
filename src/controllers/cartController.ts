import { NextFunction, Request, Response } from 'express'

import {
  addItem,
  calculateTotalPrice,
  checkStock,
  createCart,
  deleteCart,
  deleteItemFromCart,
  findCart,
  updateCart,
  updateQuantityInStock,
} from '../services/cartService'
import { findProduct } from '../services/productService'
import ApiError from '../errors/ApiError'

/** -----------------------------------------------
 * @desc Add to cart
 * @route /api/cart/
 * @method POST
 * @access public
  -----------------------------------------------*/
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const { productId, quantity, discountCode } = req.body

    const product = await findProduct(productId)

    const isValid = await checkStock(product, quantity)
    if (!isValid.status && isValid.error) {
      return next(ApiError.badRequest(isValid.error))
    }
    let cart = await createCart(userId)

    cart = await addItem(cart, quantity, product)

    const totalPrice = await calculateTotalPrice(cart, discountCode)

    // Update the product stock
    await updateQuantityInStock(productId, product.quantityInStock)

    res.json({
      message: 'Product has been added to the cart successfully',
      cart,
      Price: totalPrice,
    })
  } catch (error) {
    console.error(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Get cart items
 * @route /api/cart/:id
 * @method GET
 * @access private (user himself only)
  -----------------------------------------------*/
export const getCartItems = async (req: Request, res: Response, next: NextFunction) => {
  {
    try {
      const userId = req.params.id

      const cartItems = await findCart(userId)
      const itemsCount = cartItems.reduce((count, product) => count + product.quantity, 0)

      res.status(200).json({
        message: 'All cart items returned',
        cartItems: cartItems,
        itemsCount: itemsCount,
      })
    } catch (error) {
      next(ApiError.badRequest('Something went wrong'))
    }
  }
}

/** -----------------------------------------------
 * @desc Update cart items
 * @route /api/cart/:id
 * @method PUT
 * @access private (user himself only)
  -----------------------------------------------*/
export const updateCartItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const { _id, quantity } = req.body

    const { cart, itemsCount } = await updateCart(userId, _id, quantity)

    res.status(200).json({ message: 'Cart item has been updated successfully', cart, itemsCount })
  } catch (error) {
    console.error(error)
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Delete cart item
 * @route /api/cart/:id
 * @method DELETE
 * @access private (user himself only)
  -----------------------------------------------*/
export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const productId = req.params.productId
    const updatedCart = await deleteItemFromCart(userId, productId)

    res
      .status(200)
      .json({ meassge: 'Product has been deleted from the cart successfully', result: updatedCart })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/**-----------------------------------------------
 * @desc Delete cart by ID
 * @route /api/cart/:id
 * @method DELETE
 * @access private (admin Only)
 -----------------------------------------------*/
export const deleteCartById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await deleteCart(req.params.id)
    res.status(200).json({
      message: 'Cart has been deleted Successfully',
      payload: cart,
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}
