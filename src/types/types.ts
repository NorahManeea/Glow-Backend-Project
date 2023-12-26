import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  activationToken: string
  isAccountVerified: boolean
  isBlocked: boolean
  avatar: string
  resetPasswordToken?: string
  points: number
}

export type ProductDocument = Document & {
  name: string
  description: string
  image: string
  quantityInStock: number
  price: number
  category: mongoose.Types.ObjectId
  itemsSold: number
  discount: number
}

export type CategoryDocument = Document & {
  name: string
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
  firstName: string
  isBlocked: boolean
  iat: number
  exp: number
}

export type Role = 'USER' | 'ADMIN'

export type OrderDocument = Document & {
  uniqueId: string;
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
    province: string
    postalCode: number
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
