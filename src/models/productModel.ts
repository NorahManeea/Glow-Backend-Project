import mongoose from 'mongoose'

import { ProductDocument } from '../types/types'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    image: {
      type: String,
      default: '',
    },
    quantityInStock: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    categories: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
      required: true,
    },
    itemsSold: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'productId',
  localField: '_id',
})

export const Product = mongoose.model<ProductDocument>('Product', productSchema)
