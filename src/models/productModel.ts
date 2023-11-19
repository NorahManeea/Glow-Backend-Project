import mongoose from 'mongoose'

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
      required: true,
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
    //Category will be added after creating Category Model
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
