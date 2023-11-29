import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  isAccountVerified: boolean
  isBlocked: boolean
  avatar: string
  resetPasswordToken: string
}

export type ProductDocument = Document & {
  productName: string
  productDescription: string
  productImage: string
  quantityInStock: number
  productPrice: number
  category: mongoose.Types.ObjectId[]
  variants: string[]
  sizes: string[]
  slug: string
  itemsSold: number
  discount: number
}

export type CategoryDocument = Document & {
  categoryName: string
}
export type DiscountCodeDocument = Document & {
  code: string
  discountPercentage: number
  expirationDate: Date
}

export type DecodedUser = {
  userId: string
  email: string
  role: Role
  isBlocked: boolean
  iat: number
  exp: number
}

export type Role = 'USER' | 'ADMIN'

export type OrderDocument = Document & {
  user: string
  orderDate: Date
  products: {
    product: mongoose.Schema.Types.ObjectId
    quantity: number
  }[]
  shippingInfo: {
    country: string
    city: string
    address: string
  }
  orderStatus: string
}

export type CartDocument = Document & {
  user: string
  products: {
    product: mongoose.Schema.Types.ObjectId
    quantity: number
  }[]
}
export type WishListDocument = Document & {
  user: string
  products: {
    product: mongoose.Schema.Types.ObjectId
  }[]
}
export type ReviewDocument = {
  userId: string
  products: {
    product: mongoose.Schema.Types.ObjectId
  }
  reviewText: string
}
