import mongoose from 'mongoose';
import { DiscountCodeDocument } from '../types/types';

const discountCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const DiscountCode = mongoose.model<DiscountCodeDocument>('DiscountCode', discountCodeSchema);