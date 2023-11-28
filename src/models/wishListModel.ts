import mongoose from 'mongoose'

import { WishListDocument } from '../types/types'

const wishListSchema = new mongoose.Schema(
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
      },
    ],
  },
  { timestamps: true }
)
export const WishList = mongoose.model<WishListDocument>('WishList', wishListSchema)
