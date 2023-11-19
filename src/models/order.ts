import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingInfo: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Received'],
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model<OrderDocument>('Order', orderSchema)
