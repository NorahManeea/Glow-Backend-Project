import { NextFunction, Request, Response } from 'express'

import {
  addItem,
  calculateTotalPrice,
  createCart,
  deleteCart,
  deleteItemFromCart,
  findCart,
  updateCart,
} from '../services/cartService'
import { checkStock, findProduct } from '../services/productService'

/** -----------------------------------------------
 * @desc Add to cart
 * @route /api/cart/
 * @method POST
 * @access public
  -----------------------------------------------*/
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.decodedUser.userId
    const { productId, quantity, discountCode } = req.body

    const product = await findProduct(productId)

    await checkStock(productId, quantity)

    let cart = await createCart(userId)

    cart = await addItem(cart, quantity, product)

    const totalPrice = await calculateTotalPrice(cart, discountCode)

    res.json({
      message: 'Product has been added to the cart successfully',
      cart,
      Price: totalPrice,
    })
  } catch (error) {
    next(error)
  }
}

/** -----------------------------------------------
 * @desc Get cart items
 * @route /api/cart/:id
 * @method GET
 * @access private (user himself only)
  -----------------------------------------------*/
export const getCartItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.decodedUser.userId

    const cartItems = await findCart(userId)
    const itemsCount = cartItems.products.reduce((count, product) => count + product.quantity, 0)
    const { totalPrice, savedAmount, totalAfterDiscount } = await calculateTotalPrice(cartItems)


    res.status(200).json({
      message: 'All cart items returned',
      cartItems: cartItems,
      itemsCount: itemsCount,
      totalPrice: totalPrice,
      savedAmount: savedAmount,
      totalAfterDiscount: totalAfterDiscount,
    })
  } catch (error) {
    next(error)
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
    const userId = req.decodedUser.userId
    const { _id, quantity } = req.body

    const { cart, itemsCount } = await updateCart(userId, _id, quantity)

    res.status(200).json({ message: 'Cart item has been updated successfully', cart, itemsCount })
  } catch (error) {
    next(error)
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
    const userId = req.decodedUser.userId
    const productId = req.params.productId
    console.log(productId)
    const updatedCart = await deleteItemFromCart(userId, productId)

    res
      .status(200)
      .json({ meassge: 'Product has been deleted from the cart successfully', result: updatedCart })
  } catch (error) {
    next(error)
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
    next(error)
  }
}
