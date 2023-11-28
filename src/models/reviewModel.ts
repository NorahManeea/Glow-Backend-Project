import mongoose from 'mongoose'
import { ReviewDocument } from '../types/types'

const reviewSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
    },
  },
  { timestamps: true }
)

export const Review = mongoose.model<ReviewDocument>('Review', reviewSchema)
