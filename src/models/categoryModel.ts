import mongoose from 'mongoose'

import { CategoryDocument } from '../types/types'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 30,
    required: true,
  },
}, { timestamps: true })

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema)
