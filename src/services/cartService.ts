import { Cart } from '../models/cartModel'
import { CartDocument, ProductDocument, DiscountCodeDocument } from '../types/types'
import { Product } from '../models/productModel'
import ApiError from '../errors/ApiError'
import { DiscountCode } from '../models/discountCodeModel'

export const createCart = async (userId: string): Promise<CartDocument> => {
  let cart = await Cart.findOne({ user: userId })
  if (!cart) {
    cart = await Cart.create({ user: userId, products: [] })
  }
  return cart
}

export const checkStock = async (product: ProductDocument, quantity: number) => {
  if (product.quantityInStock === 0) {
    return { status: false, error: 'Product is currently out of stock' }
  }
  if (quantity > product.quantityInStock) {
    return { status: false, error: `Quantity requested exceeds quantity available in stock.` }
  }
  return { status: true, error: null }
}

export const addItem = async (
  cart: CartDocument,
  quantity: number,
  product: ProductDocument
): Promise<CartDocument> => {
  const existingCartItem = cart.products.find(
    (p) => p.product.toString() === product._id.toString()
  )
  if (existingCartItem) {
    existingCartItem.quantity += quantity
  } else {
    cart.products.push({ product: product._id, quantity: quantity })
  }
  await cart.save()

  return cart
}

export const calculateTotalPrice = async (
  cart: CartDocument,
  discountCode: DiscountCodeDocument
) => {
  const total = await Promise.all(
    cart.products.map(async (product) => {
      try {
        const productFound = await Product.findById(product.product)
        const productPrice = productFound?.productPrice || 1
        return productPrice * product.quantity
      } catch (error) {
        console.error(`Error fetching product: ${error}`)
        return 0
      }
    })
  )
  let totalPrice = total.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  let savedAmount = 0
  let totalAfterDiscount = 0

  console.log(await DiscountCode.findById(discountCode))
  const isDiscountCodeFound = await DiscountCode.findById(discountCode)
  if (isDiscountCodeFound) {
    savedAmount = (totalPrice * isDiscountCodeFound.discountPercentage) / 100
    totalAfterDiscount = totalPrice - savedAmount
  } else {
    console.log('Discount Code not found or is null.')
  }

  return { totalPrice, savedAmount, totalAfterDiscount }
}

export const updateQuantityInStock = async (productId: string, quantityInStock: number) => {
  await Product.findByIdAndUpdate(
    productId,
    { $set: { quantityInStock: quantityInStock - 1 } },
    { new: true }
  )
}

export const findCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId }).populate('products.product')
  if (!cart) {
    throw ApiError.notFound(`Cart not found with userId: ${userId}`)
  }
  return cart.products
}

export const updateCart = async (userId: string, cartItemId: string, quantity: number) => {
  try {
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      throw ApiError.notFound(`Cart not found`)
    }

    const CartItemIndex = cart.products.findIndex(
      (product) => product.product.toString() === cartItemId
    )
    if (CartItemIndex === -1) {
      throw ApiError.notFound('Product not found in the cart')
    }

    cart.products[CartItemIndex].quantity = quantity
    const updatedCart = await cart.save()
    const itemsCount = updatedCart.products.reduce((count, product) => count + product.quantity, 0)

    return { cart: updatedCart, itemsCount }
  } catch (error) {
    console.log(error)
    throw new Error('Failed to update cart item')
  }
}

export const deleteItemFromCart = async (userId: string, carttItemId: string) => {
  //check if the cart exist
  const cart = await Cart.findOne({ user: userId })
  if (!cart) {
    return ApiError.notFound(`Cart not found with userId: ${userId}`)
  }

  // check if the product in the cart
  const deletedItem = cart.products.find((p) => p.product.toString() === carttItemId)
  if (!deletedItem) {
    return ApiError.notFound(`Product with id: ${userId} not found in the cart`)
  }

  //delete the product from the cart
  const updatedCart = await Cart.findOneAndUpdate(
    { user: userId, 'products.product': carttItemId },
    { $pull: { products: { product: carttItemId } } },
    { new: true }
  )

  return updatedCart
}

export const deleteCart = async (userId: string) => {
  const cart = await Cart.findOneAndDelete({ user: userId })
  if (!cart) {
    return ApiError.notFound(`Cart not found with the ID: ${userId}`)
  }
  return cart
}
