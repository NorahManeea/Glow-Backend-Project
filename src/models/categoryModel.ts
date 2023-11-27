import mongoose from 'mongoose'

import { CategoryDocument } from '../types/types'

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    minlength: 3,
    maxlength: 30,
    required: true,
  },
})

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema)
