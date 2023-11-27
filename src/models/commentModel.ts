import mongoose from 'mongoose'
import { CommentDocument } from '../types/types'

const commentSchema = new mongoose.Schema(
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

export const Comment = mongoose.model<CommentDocument>('Comment', commentSchema)
