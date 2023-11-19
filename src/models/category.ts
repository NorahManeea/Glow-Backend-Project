// import mongoose from 'mongoose'

// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     index: true,
//     required: true,
//   },
// })

// export default mongoose.model('Category', categorySchema)

import mongoose, { Document, Schema } from 'mongoose'

// Define the interface for the Category
export interface ICategory extends Document {
  name: string
}

// Create the schema for the Category model
const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    index: true,
    required: true,
  },
})

// Create and export the Category model
const Category = mongoose.model<ICategory>('Category', categorySchema)

export default Category
