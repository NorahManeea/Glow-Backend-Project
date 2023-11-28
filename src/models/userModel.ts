import mongoose from 'mongoose'

import { UserDocument } from '../types/types'


function validateRole(role: string) {
  if (role === 'USER' || role === 'ADMIN') {
    return true
  }
  return false
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
   role:{ type: String,
    default: 'USER',
    validate: [validateRole, 'Role has to be either USER or ADMIN'],},
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked:{
      type: Boolean,
      default: false
    },
    avatar:{
      type: String,
      default: ''
    }
  },
  
  { timestamps: true }
)

export const User = mongoose.model<UserDocument>('User', userSchema)