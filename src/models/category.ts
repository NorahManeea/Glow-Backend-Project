import mongoose, { Document} from 'mongoose'

export type CategoryDocument = Document & {
  categoryName: string;
  categoryDescription: string;
}
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: true,
  },
})

export default mongoose.model<CategoryDocument>('Category', categorySchema)
