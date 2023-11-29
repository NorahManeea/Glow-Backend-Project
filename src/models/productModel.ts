import mongoose from 'mongoose'

import { ProductDocument } from '../types/types'

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    productDescription: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
    },
    productImage: {
      type: String,
      default: ''
    },
    quantityInStock: {
      type: Number,
      required: true,
      default: 1,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
      required: true,
    },
    variants: {
      type: [String],
    },
    sizes: {
      type: [String],
    },
    itemsSold:{
      type: Number
    },  
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export const Product = mongoose.model<ProductDocument>('Product', productSchema)
