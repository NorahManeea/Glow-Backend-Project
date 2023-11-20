import mongoose,{ Document } from 'mongoose';

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },
  },
  { timestamps: true }
)

export const User = mongoose.model<UserDocument>('User', userSchema)
