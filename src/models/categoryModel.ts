import mongoose, { Document} from 'mongoose';

export type CategoryDocument = Document & {
  categoryName: string;
}
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    minlength: 3,
    maxlength: 30,
    required: true,
  },
})

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema)
