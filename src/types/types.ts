import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  isAccountVerified: boolean
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
}

export type CategoryDocument = Document & {
  categoryName: string
}

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
