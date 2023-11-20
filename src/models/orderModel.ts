import mongoose from 'mongoose'
import { OrderDocument } from '../types/types'

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
