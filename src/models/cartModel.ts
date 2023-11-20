import mongoose from 'mongoose'
export type CartDocument = Document & {
  user: string
  products: {
    product: mongoose.Schema.Types.ObjectId
    quantity: number
  }[]
}
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
  },
  { timestamps: true }
)
export const Cart =  mongoose.model<CartDocument>('Cart', cartSchema)