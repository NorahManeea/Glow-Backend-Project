import { Review } from '../models/reviewModel'
import { CategoryDocument } from '../types/types'
import ApiError from '../errors/ApiError'

export const findAllReviews = async () => {
  const reviews = await Review.find()
  return reviews
}