import ApiError from '../errors/ApiError'
import { DiscountCode } from '../models/discountCodeModel'
import { DiscountCodeDocument } from '../types/types'

//** Service:- Get All Discount Codes  */
export const findAllDiscountCodes = async () => {
  const discountCodes = await DiscountCode.find()
  if (discountCodes.length === 0) {
    throw ApiError.notFound('There are no discount codes')
  }
  return discountCodes
}

//** Service:- Get Signle Discount Code */
export const findACode = async (code: string) => {
  console.log('Searching for code:', code);
  const discountCode = await DiscountCode.findOne({ code: code });

  if (!discountCode) {
    console.log(`Code not found with code: ${code}`);
    throw ApiError.notFound(`Code not found with code: ${code}`);
  }

  const currentDate = new Date();
  if (discountCode.expirationDate < currentDate) {
    console.log(`Code is not valid: ${code}`);
    throw ApiError.notFound(`Code is not valid`);
  }

  return discountCode;
};


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
