import { Product } from './../models/productModel'
import { Request, Response } from 'express'
import { Cart } from '../models/cartModel'
import { findCart, updateCart } from '../services/cartService'

/** -----------------------------------------------
 * @desc Add to cart
 * @route /api/cart/
 * @method POST
 * @access public
  -----------------------------------------------*/
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { user, productId, quantity } = req.body
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    if (product.quantityInStock === 0) {
      return res.status(400).json({ message: 'Product is currently unavailable' })
    }
    if (quantity > product.quantityInStock) {
      return res
        .status(400)
        .json({ message: 'Quantity requested exceeds quantity available in stock.' })
    }
    let cart = await Cart.findOne({ user: user })
    if (!cart) {
      cart = await Cart.create({ user: user, products: [] })
    }
    const existingCartItem = cart.products.find((p) => p.product.toString() === productId)
    if (existingCartItem) {
      existingCartItem.quantity += quantity
    } else {
      cart.products.push({ product: productId, quantity: quantity })
    }
    let total = 0
    cart.products.forEach((p) => {
      const productPrice = product.productPrice
      const productQuantity = p.quantity
      total += productPrice * productQuantity
    })

    await cart.save()
    const updataQuantityInStock = (product.quantityInStock -= quantity)
    await Product.findByIdAndUpdate(
      productId,
      { $set: { quantityInStock: updataQuantityInStock } },
      { new: true }
    )
    res.json({ message: 'Product has been added to cart successfully', cart, total })
  } catch (error) {
    res.status(500).json({ error: error })
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
