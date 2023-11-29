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
    throw ApiError.notFound(`Product is currently out of stock`)
  }
  if (quantity > product.quantityInStock) {
    throw ApiError.notFound(`Quantity requested exceeds quantity available in stock.`)
  }
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

export const calculateTotalPrice = async (cart: CartDocument): Promise<number> => {
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

  console.log('Total Price before discount:', totalPrice)

  if (cart.discountCode) {
    const discountCode = await DiscountCode.findById(cart.discountCode)
    if (discountCode) {
      console.log('Discount Code found:', discountCode)

      const discountPercentage = discountCode.discountPercentage
      console.log('Discount Percentage:', discountPercentage)

      const discountAmount = (totalPrice * discountPercentage) / 100
      console.log('Discount Amount:', discountAmount)

      totalPrice -= discountAmount
      totalPrice = Math.ceil(totalPrice)
    }
  }

  console.log('Total Price after discount:', totalPrice)
  return totalPrice
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
    console.log(`cart`)
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, 'products._id': cartItemId },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    )
    console.log(`cart: ${updatedCart}`)

    if (!updatedCart) {
      throw ApiError.notFound(`Cart or product not found`)
    }

    const itemsCount = updatedCart.products.reduce((count, product) => count + product.quantity, 0)
    return { cart: updatedCart, itemsCount }
  } catch (error) {
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
  console.log("2: "+ cart)
  if (!cart) {
    return ApiError.notFound(`Cart not found with the ID: ${userId}`)
  }
  return cart
}