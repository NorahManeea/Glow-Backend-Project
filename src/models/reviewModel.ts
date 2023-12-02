import mongoose from 'mongoose'
import { ReviewDocument } from '../types/types'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    productId: {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    },
    reviewText: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 250,
    },
  },
  { timestamps: true }
)

export const Review = mongoose.model<ReviewDocument>('Review', reviewSchema)
