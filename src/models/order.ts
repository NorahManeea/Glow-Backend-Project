import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    products: {
      product: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      subTotal: {
        type: Number,
        required: true,
      },
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
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model<OrderDocument>('Order', orderSchema)
