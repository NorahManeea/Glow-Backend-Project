import mongoose from 'mongoose'

import { CartDocument } from '../types/types'

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    discountCode:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiscountCode',
    }
  },
  { timestamps: true }
)
export const Cart = mongoose.model<CartDocument>('Cart', cartSchema)
