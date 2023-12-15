import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import { OrderDocument } from '../types/types'
import { OrderStatus } from '../enums/enums'

//** Custom Order ID */
let randomvalue = ''
const customAlphabet = '1234567890abcdefghijklmnopqrstuvwxyz'
const length = 5
for (let i = 0; i < length; i++) {
  const value = Math.floor(Math.random() * customAlphabet.length)
  randomvalue += customAlphabet.substring(value, value + 1).toUpperCase()
}

const orderSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      default: randomvalue,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    shippingInfo: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true }
)

export const Order = mongoose.model<OrderDocument>('Order', orderSchema)
