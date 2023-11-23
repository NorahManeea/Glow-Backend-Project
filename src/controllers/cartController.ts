import { Product } from './../models/productModel'
import { Request, Response } from 'express'
import { Cart } from '../models/cartModel'

/** -----------------------------------------------
 * @desc Add to cart
 * @route /api/cart/
 * @method POST
 * @access public
  -----------------------------------------------*/
export const addToCart = async (req: Request, res: Response) => {
  const { user, productId, quantity } = req.body
  try {
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
    res.json({ cart, total })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

/** -----------------------------------------------
 * @desc Get cart items
 * @route /api/cart/:id
 * @method GET
 * @access private (user himself only)
  -----------------------------------------------*/
export const getCartItems = async (req: Request, res: Response) => {
  const { cartId } = req.params
  try {
    const cart = await Cart.findById(cartId)
    console.log(cartId)
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }
    const itemsCount = cart.products.reduce((count, product) => count + product.quantity, 0)
    res.status(200).json({
      cartItems: cart.products,
      itemsCount: itemsCount,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/** -----------------------------------------------
 * @desc Update cart items
 * @route /api/cart/:id
 * @method PUT
 * @access private (user himself only)
  -----------------------------------------------*/
export const updateCartItems = async (req: Request, res: Response) => {
  const { cartItem } = req.body
  const { id } = req.params
  try {
    const updatedItem = await Cart.findOneAndUpdate(
      {_id: id,
        'products.product': cartItem._id,
      },
      {$set: {
          'products.$.quantity': cartItem.quantity,
        },
      },{ new: true }
    )
    if (!updatedItem) {
      return res.status(404).json({ error: 'Cart or product not found' })
    }
    res.status(200).json(updatedItem)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
/** -----------------------------------------------
 * @desc Delete cart item
 * @route /api/cart/:id
 * @method DELETE
 * @access private (user himself only)
  -----------------------------------------------*/
export const deleteCartItem = async (req: Request, res: Response) => {
  const { id } = req.params
  const { productId } = req.body
  console.log(req.params.id)
  try {
    const cart = await Cart.findById(id)
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }
    const deletedItem = cart.products.find((p) => p.product.toString() === productId)

    if (!deletedItem) {
      return res.status(404).json({ error: 'Product not found in the cart' })
    }
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: id, 'products.product': productId },
      { $pull: { products: { product: productId } } },
      { new: true }
    );
    
    if (!updatedCart) {
      return res.status(404).json({ error: 'error'});
    }
    if (!updatedCart) {
      return res.status(404).json({ error: 'error' })
    }
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const updatedQuantityInStock = product.quantityInStock + deletedItem.quantity

    await Product.findByIdAndUpdate(
      productId,
      { $set: { quantityInStock: updatedQuantityInStock } },
      { new: true }
    )
    res.status(200).json({
      message: 'Product has been deleted successfully',
      cartItem: deletedItem,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
