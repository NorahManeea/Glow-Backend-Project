import ApiError from '../errors/ApiError'
import { DiscountCode } from '../models/discountCodeModel'
import { DiscountCodeDocument } from '../types/types'

//** Service:- Get All Discount Codes  */
export const findAllDiscountCodes = async () => {
  const discountCodes = await DiscountCode.find()
  return discountCodes
}
//** Service:- Get a Discount Code  */
export const findDiscountCode = async (discountCodeId: string) => {
  const discounCode = await DiscountCode.findById(discountCodeId)
  return discounCode
}

//** Service:- Get Valid Discount Code  */
export const findValidDiscountCodes = async () => {
  const currentDate = new Date()
  const validDiscountCodes = await DiscountCode.find({
    expirationDate: { $gt: currentDate },
  })
  return validDiscountCodes
}

//** Service:- Add Discount Code  */
export const createNewDiscountCode = async (newDiscountCode: DiscountCodeDocument) => {
  const discounCode = await DiscountCode.create(newDiscountCode)
  return discounCode
}

//** Service:- Remove Discount Code  */
export const removeDiscountCode = async (discountCodeId: string) => {
  const discounCode = await DiscountCode.findByIdAndDelete(discountCodeId)
  return discounCode
}
//** Service:- Update Discount Code  */
export const updateDiscountCode = async (
  discountCodeId: string,
  updatedDiscountCode: DiscountCodeDocument
) => {
  const discountCode = await DiscountCode.findByIdAndUpdate(
    discountCodeId,
    { updatedDiscountCode },
    { new: true }
  )
  if (!discountCode) {
    throw ApiError.notFound('Product not found with the entered ID')
  }
  return discountCode
}
