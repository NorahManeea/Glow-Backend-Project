import { Request, Response } from 'express'

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

/** -----------------------------------------------
 * @desc Add to cart
 * @route /api/cart/
 * @method POST
 * @access public
  -----------------------------------------------*/
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { user, productId, quantity } = req.body

    // Check if the product exists
    const product = await findProduct(productId)

    // Check if the product is in stock
    checkStock(product, quantity)

    // Create cart if the user doesn't have one
    let cart = await createCart(user)

    // Add the item to the cart
    cart = await addItem(cart, quantity, product)

    // Calculate the total price
    const totalPrice = await calculateTotalPrice(cart)

    // Update the product stock
    await updateQuantityInStock(productId, product.quantityInStock)

    res.json({
      message: 'Product has been added to the cart successfully',
      cart,
      Price: totalPrice,
    })
  } catch (error) {
    // Handle specific errors with different status codes if needed
    res.status(500).json({ error: error || 'Internal Server Error' })
  }
}

/** -----------------------------------------------
 * @desc Get cart items
 * @route /api/cart/:id
 * @method GET
 * @access private (user himself only)
  -----------------------------------------------*/
export const getCartItems = async (req: Request, res: Response) => {
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
      res.status(500).json({ error: error })
    }
  }
}

/** -----------------------------------------------
 * @desc Update cart items
 * @route /api/cart/:id
 * @method PUT
 * @access private (user himself only)
  -----------------------------------------------*/
export const updateCartItems = async (req: Request, res: Response) => {
  try {
    const { cartItem } = req.body
    const { userId } = req.params
    const { cart, itemsCount } = await updateCart(userId, cartItem._id, cartItem.quantity)

    res.status(200).json({ message: 'Cart item has been updated successfully', cart, itemsCount })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

/** -----------------------------------------------
 * @desc Delete cart item
 * @route /api/cart/:id
 * @method DELETE
 * @access private (user himself only)
  -----------------------------------------------*/
export const deleteCartItem = async (req: Request, res: Response) => {}
