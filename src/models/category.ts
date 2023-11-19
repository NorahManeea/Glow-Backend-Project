import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: true,
  },
})

export default mongoose.model('Category', categorySchema)
