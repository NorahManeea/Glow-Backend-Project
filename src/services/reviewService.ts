import { Review } from '../models/reviewModel'

export const findAllReviews = async () => {
  const reviews = await Review.find()
  return reviews
}