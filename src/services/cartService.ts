import { Cart } from '../models/cartModel'
import { CartDocument, UserDocument, ProductDocument } from '../types/types'
import { Product } from '../models/productModel'
import ApiError from '../errors/ApiError'

export const createCart = async (user: UserDocument): Promise<CartDocument> => {
  let cart = await Cart.findOne({ user: user })
  if (!cart) {
    cart = await Cart.create({ user: user, products: [] })
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

export const calculateTotalPrice = async (cart: CartDocument, discountCode: string): Promise<number> => {
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
  if (discountCode) {
    const discountAmount = calculateDiscountAmount(totalPrice, discountCode);
    totalPrice -= discountAmount;
  }

  console.log(totalPrice)
  return totalPrice
}

export const calculateDiscountAmount = (totalPrice: number, discountCode: string): number => {
  let discountPercentage = 0;
    const discountValue = parseInt(discountCode);
  if (discountValue) {
    discountPercentage = discountValue / 100;
  }

  const discountAmount = totalPrice * discountPercentage;
  return discountAmount;
};

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
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, 'products._id': cartItemId },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    )

    if (!updatedCart) {
      throw ApiError.notFound(`Cart or product now found`)
    }

    const itemsCount = updatedCart.products.reduce((count, product) => count + product.quantity, 0)
    return { cart: updatedCart, itemsCount }
  } catch (error) {
    throw new Error('Failed to update cart item')
  }
}
