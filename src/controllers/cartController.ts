import { Request, Response } from 'express'
import { Cart } from '../models/cartModel'
import { Product } from '../models/productModel'

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
      return res.status(404).json({ error: 'Product not found' })
    }
    if (product.quantityInStock === 0) {
      return res.status(400).json({ error: 'Product is currently unavailable' })
    }
    if (quantity > product.quantityInStock) {
      return res
        .status(400)
        .json({ error: 'Quantity requested exceeds quantity available in stock.' })
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
  const { id } = req.params

  try {
    const cart = await Cart.findOne({ user: id }).populate('products.product')

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }
    const itemsCount = cart.products.reduce((total, item) => total + item.quantity, 0)

    res.json({ cart, itemsCount })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
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
    const { productId, quantity } = req.body

    const updatedItem = await Cart.findOneAndUpdate(
      { 'products._id': productId },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    )

    if (!updatedItem) {
      return res.status(404).json({ error: 'Product not found in the cart' })
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
  // const { productId } = req.params
  // await Cart.deleteOne({
  //   _id: Cart,
  // })
  // res.status(204).send()
}
