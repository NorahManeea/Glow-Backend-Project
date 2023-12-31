import ApiError from '../errors/ApiError'
import { Review } from '../models/reviewModel'
import { ReviewDocument } from '../types/types'

//** Service:- Get All Reviews  */
export const findAllReviews = async () => {
  const reviews = await Review.find().populate('user')
  if (reviews.length == 0) {
    throw ApiError.notFound('There are no reviews')
  }

  return reviews
}
export const findReviewById = async (id: string) => {
  const reviews = await Review.findById(id).populate('user')

  return reviews
}

//** Service:- Remove a Review  */
export const removeReview = async (reviewId: string) => {
  const review = await Review.findByIdAndDelete(reviewId)
  if (!review) {
    throw ApiError.notFound(`Review not found with the ID: ${reviewId}`)
  }
  return review
}

//** Service:- Add new Reviews  */
export const createNewReview = async (newReveiew: ReviewDocument) => {
  const review = await Review.create(newReveiew)
  return review
}
