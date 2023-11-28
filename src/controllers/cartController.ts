import { NextFunction, Request, Response } from 'express'

import {
  addItem,
  calculateTotalPrice,
  checkStock,
  createCart,
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
    const { user, productId, quantity, discountCode } = req.body
    console.log(req.body)

    const product = await findProduct(productId)

    await checkStock(product, quantity).catch((error) => {
      throw new Error(error.message)
    })

    let cart = await createCart(user)

    cart = await addItem(cart, quantity, product)

    const totalPrice = await calculateTotalPrice(cart);

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
      const { id } = req.params
      const cartItems = await findCart(id)
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
    const { cartItem } = req.body
    const { userId } = req.params
    const { cart, itemsCount } = await updateCart(userId, cartItem._id, cartItem.quantity)

    res.status(200).json({ message: 'Cart item has been updated successfully', cart, itemsCount })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong'))
  }
}

/** -----------------------------------------------
 * @desc Delete cart item
 * @route /api/cart/:id
 * @method DELETE
 * @access private (user himself only)
  -----------------------------------------------*/
export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {}
