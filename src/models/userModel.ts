import mongoose from 'mongoose'
import { UserDocument } from '../types/types'
import { Role } from '../enums/enums'

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
      lowercase: true,
      validate: {
        validator: function (email: string){
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        },
        message: 'Please enter a valid email address'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: Role,
      default: Role.USER,
    },
  },
  { timestamps: true }
)

export const User = mongoose.model<UserDocument>('User', userSchema)
