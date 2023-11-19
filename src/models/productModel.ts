import mongoose from 'mongoose'

export type ProductDocument = Document &{
  productName: string;
  productDescription: string;
  productImage: string;
  quantityInStock: number;
  productPrice: number;
  category: mongoose.Types.ObjectId[]; 
}

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
    productPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: [{ type:
        mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      }], 
      required: true,
     },
  },
  { timestamps: true }
)

export default mongoose.model<ProductDocument>('Product', productSchema)
