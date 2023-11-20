import mongoose, { Document } from 'mongoose'

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

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    products: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      }
    }],
    shippingInfo: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
  },
  { timestamps: true }
)

export const Order =  mongoose.model<OrderDocument>('Order', orderSchema)
